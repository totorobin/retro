import {v4 as uuid} from "uuid";
import {Components} from "../app";
import {Server, Socket} from "socket.io";
import {EventEmitter} from 'events'
import {SavedBoard} from "./board.repository";
import {BoardComponent} from "@retro/shared";

export default function ({userRepo, boardRepo}: Components, emitter: EventEmitter) {
    return {
        newBoard: (io: Server, socket: Socket) =>
            async function (
                boardId: string | null,
                callback: (boardName: string) => void
            ) {
                if (!boardId) {
                    boardId = uuid();
                }

                const board: SavedBoard = {
                    uuid: boardId,
                    users: [socket.data.userId],
                    components: []
                };

                await boardRepo.save(board);

                socket.join(`board-${boardId}`);

                callback(boardId);

                emitter.emit('broadcastBoards', [boardId])
            },
        joinBoard: (io: Server, socket: Socket) =>
            async function (boardId: string) {
                // mise a jour du board
                let board: SavedBoard;
                try {
                    board = await boardRepo.findById(boardId);
                } catch (e) {
                    console.error(e);
                    socket.emit("kickOut")
                    return
                }

                // si nouvel utilisateur : mise a jour du board
                if (!board.users.find(uuid => uuid === socket.data.userId)) {
                    board.users.push(socket.data.userId);
                    await boardRepo.save(board);
                }

                // socket est lié à la board
                socket.join(`board-${boardId}`);

                // toutes les sockets liés à la board sont mise a jour avec le nouvel état
                emitter.emit('broadcastBoards', [boardId])
            },
        addComponent: (io: Server, socket: Socket) =>
            async function (boardId: string, component: BoardComponent, callback: (componentId: string) => void) {
                component.id = uuid();
                component.owner = socket.data.userId;

                let board: SavedBoard;
                try {
                    board = await boardRepo.findById(boardId);
                } catch (e) {
                    console.error(e);
                    socket.emit("kickOut")
                    return
                }
                board.components.push(component);
                await boardRepo.save(board)

                callback(component.id);

                // toutes les sockets liés à la board sont mise a jour avec le nouvel état
                emitter.emit('broadcastBoards', [boardId])
            },
        updateComponent: (io: Server, socket: Socket) =>
            async function (boardId: string, component: BoardComponent) {
                let board: SavedBoard;
                try {
                    board = await boardRepo.findById(boardId);
                } catch (e) {
                    console.error(e);
                    socket.emit("kickOut")
                    return
                }

                const originalComponent = board.components.find(c => c.id === component.id);
                if(originalComponent && originalComponent.owner === socket.data.userId) {
                    Object.assign(originalComponent, component);
                    await boardRepo.save(board)
                }

                // toutes les sockets liés à la board sont mise a jour avec le nouvel état
                emitter.emit('broadcastBoards', [boardId])

            },
        deleteComponent: (io: Server, socket: Socket) =>
            async function (boardId: string, componentId: string) {
                let board: SavedBoard;
                try {
                    board = await boardRepo.findById(boardId);
                } catch (e) {
                    console.error(e);
                    socket.emit("kickOut")
                    return
                }

                const indexOriginal = board.components.findIndex(c => c.id === componentId);
                if(indexOriginal > -1 && board.components[indexOriginal].owner === socket.data.userId) {
                    board.components.splice(indexOriginal, 1)
                    await boardRepo.save(board)
                }

                // toutes les sockets liés à la board sont mise a jour avec le nouvel état
                emitter.emit('broadcastBoards', [boardId])
            }
    };
}
