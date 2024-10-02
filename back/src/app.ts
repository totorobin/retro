
import { ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData } from '@knightmare-chess/shared'
import { Server as HttpServer } from "http";
import {Server, ServerOptions} from "socket.io";
import {UserRepository} from "./user/user.repository";
import createUserHandler from "./user/user.handler"

export interface Components {
    userRepo: UserRepository
}

export function createApplication(
    httpServer: HttpServer,
    components: Components,
    serverOptions: Partial<ServerOptions> = {}
): Server<ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData> {
    const io = new Server<ClientToServerEvents,
        ServerToClientEvents,
        InterServerEvents,
        SocketData>(httpServer, serverOptions);

    const { login, logout } = createUserHandler(components)

    io.on("connection", (socket) => {

        socket.on("login", login(io,socket));
    });

    io.of("/").adapter.on("delete-room", (room: string) => {
        if(room.startsWith('user-')) {
            const userId = room.replace('user-', '')
            console.log(`user ${userId} has disconnected`)
            logout(io)(userId)
        }
    });

    return io;
}