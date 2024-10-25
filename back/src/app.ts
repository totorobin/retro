import {ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData} from "@retro/shared";
import {Server as HttpServer} from "http";
import {Server, ServerOptions} from "socket.io";
import {UserRepository} from "./user/user.repository";
import createUserHandler from "./user/user.handler";
import {BoardRepository} from "./board/board.repository";
import createBoardHandler from "./board/board.handler";
import {getUserData} from "../auth/google-auth";
import createEventHandler from './events/broadcast.events'


export interface Components {
    userRepo: UserRepository;
    boardRepo: BoardRepository;
}

export function createApplication(
    httpServer: HttpServer,
    components: Components,
    serverOptions: Partial<ServerOptions> = {}
): Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
> {
    const io = new Server<
        ClientToServerEvents,
        ServerToClientEvents,
        InterServerEvents,
        SocketData
    >(httpServer, serverOptions);

    const emitter = createEventHandler(io, components);

    const {login, logout} = createUserHandler(components, emitter);
    const {
        myBoards,
        newBoard,
        joinBoard,
        leaveBoard,
        addComponent,
        updateComponent,
        deleteComponent
    } = createBoardHandler(components, emitter);

    io.on("connection", (socket) => {
        console.log(socket.handshake.auth); // prints { token: "abcd" }

        getUserData(socket.handshake.auth)
            .then((user) => login(io, socket)(user))
            .catch((e) => {
                console.error('erreur de connection', e)
                socket.disconnect(true)
            })


        socket.on("login", login(io, socket));
        socket.on("newBoard", newBoard(io, socket));
        socket.on("joinBoard", joinBoard(io, socket));
        socket.on('leaveBoard', leaveBoard(io, socket));
        socket.on('addComponent', addComponent(io, socket));
        socket.on('updateComponent', updateComponent(io, socket));
        socket.on('deleteComponent', deleteComponent(io, socket));
        socket.on('myBoards', myBoards(io, socket));
    });

    io.of("/").adapter.on("delete-room", (room: string) => {
        if (room.startsWith("user-")) {
            const userId = room.replace("user-", "");
            console.log(`user ${userId} has disconnected`);
            logout(io)(userId);
        }
    });

    io.of("/").adapter.on("join-room", (room: string, id: string) => {
        console.log("joining room", room, id);
        if (room.startsWith("board-")) {
            const boardId = room.replace("board-", "");
            // toutes les sockets liés à la board sont mise a jour avec le nouvel état
            emitter.emit('broadcastBoards', [boardId])
        }
    })
    io.of("/").adapter.on("leave-room", (room: string, id: string) => {
        console.log("leaving room", room, id);
        if (room.startsWith("board-")) {
            const boardId = room.replace("board-", "");
            // toutes les sockets liés à la board sont mise a jour avec le nouvel état
            emitter.emit('broadcastBoards', [boardId])
        }
    })

    return io;
}
