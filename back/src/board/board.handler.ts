import {v4 as uuid} from "uuid";
import {Components} from "../app";
import {Server, Socket} from "socket.io";
import {EventEmitter} from 'events'
import {SavedBoard, BoardComponent, PostIt, Area} from "@retro/shared";

const updatePostItColor = (board: SavedBoard, component: PostIt) => {
   const areas : Area[] = board.components
        .filter(c => c.type === 'area').map(c => c as Area)
        .filter(c => c.position[0] < component.position[0] && component.position[0] < c.position[2])
        .filter(c => c.position[1] < component.position[1] && component.position[1] < c.position[3])
        .slice(-1)

    if(areas.length == 1) {
        if(areas[0].color) {
            component.color = areas[0].color
        }
        component.visible = areas[0].forceVisiblility ?? component.visible
    }
}
const updateAllPostIt = (board: SavedBoard, component: Area) => {
    if(component.color || component.forceVisiblility != null)
        board.components.filter(c=> c.type === 'postIt').map(c => c as PostIt)
            .filter(pi => component.position[0] < pi.position[0] && pi.position[0] < component.position[2])
            .filter(pi => component.position[1] < pi.position[1] && pi.position[1] < component.position[3])
            .map(pi => {
                if(component.color) {
                    pi.color = component.color
                }
                pi.visible = component.forceVisiblility ?? pi.visible
            })
}
export default function ({userRepo, boardRepo}: Components, emitter: EventEmitter) {
    return {
        myBoards: (io: Server, socket: Socket) => async function (callback: (myBoards : Array<SavedBoard>) => void) {
            try {
               let boards = await boardRepo.findAllByUser(socket.data.userId);
                callback(boards);
                console.log("myBoards sent", boards);
            } catch (e) {
                console.error(e);
                return
            }
        },
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
                    ownerId: socket.data.userId,
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
                    console.error('error joining board', e);
                    socket.emit("kickOut")
                    return
                }

                // si nouvel utilisateur : mise a jour du board
                if (!board.users.find(uuid => uuid === socket.data.userId)) {
                    board.users.push(socket.data.userId);
                    await boardRepo.save(board);
                }

                console.log(`user ${socket.data.userId} joined board ${boardId}`);
                // socket est lié à la board
                socket.join(`board-${boardId}`);

            },
        leaveBoard: (io: Server, socket: Socket) => async function (boardId: string) {
            console.log(`user ${socket.data.userId} leaving board ${boardId}`);
            socket.leave(`board-${boardId}`);
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
                if(component.type === 'postIt') {
                    updatePostItColor(board, component as PostIt)
                }
                await boardRepo.save(board)

                // toutes les sockets liés à la board sont mise a jour avec le nouvel état
                emitter.emit('broadcastBoards', [boardId])

                callback(component.id);
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
                if (originalComponent && originalComponent.owner === socket.data.userId) {
                    if(component.type === 'postIt') {
                        updatePostItColor(board, component as PostIt)
                    } else if(component.type === 'area') {
                        updateAllPostIt(board, component as Area)
                    }
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
                if (indexOriginal > -1 && board.components[indexOriginal].owner === socket.data.userId) {
                    board.components.splice(indexOriginal, 1)
                    await boardRepo.save(board)
                }

                // toutes les sockets liés à la board sont mise a jour avec le nouvel état
                emitter.emit('broadcastBoards', [boardId])
            }
    };
}
