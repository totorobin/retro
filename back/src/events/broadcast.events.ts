import {EventEmitter} from 'events'
import {Server} from 'socket.io';
import {Components} from '../app';
import {Board} from '@retro/shared'

export default function (io: Server, {userRepo, boardRepo}: Components) {
    const emitter = new EventEmitter();

    emitter.on('broadcastUsers', (users: string[]) => {
        users.forEach(async (userId) => {
            try {
                const user = await userRepo.findById(userId)

                io.to(`user-${user.uuid}`).emit("logged", user);
            } catch (e) {
                console.log('board %s not found, nothing to emit', userId)
            }
        })
    });

    emitter.on('broadcastAllUsers', async () => {
        const players = await userRepo.findAll();
        console.log("broadcast players : ", players);
        io.emit("players", players);
    })

    emitter.on('broadcastBoards', async (boards: string[]) => {
        for (const boardId of boards) {
            try {
                const savedBoard = await boardRepo.findById(boardId)

                const board: Board = {
                    uuid: savedBoard.uuid,
                    users: [],
                    components: savedBoard.components,
                }
                for (const uuid of savedBoard.users) {
                    board.users.push(await userRepo.findById(uuid))
                }

                console.log("broadcast board : ", boardId);
                io.to(`board-${boardId}`).emit("board", board);
            } catch (e) {
                console.log('board %s not found, nothing to emit', boardId)
            }
        }
    });

    emitter.on('broadcastBoardsFromUser', async (uuid: string) => {
        try {
            const boards = await boardRepo.findAllByUser(uuid)
            emitter.emit('broadcastBoards', boards.map(b => b.uuid))

        } catch (e) {
            console.log('no board found for user %s, nothing to emit', uuid)
        }
    })

    return emitter;
}