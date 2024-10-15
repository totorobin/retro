import { v4 as uuid } from "uuid";
import { Components } from "../app";
import { Server, Socket } from "socket.io";
import { EventEmitter } from 'events'
import { SavedBoard } from "./board.repository";

export default function ({ userRepo, boardRepo }: Components, emitter: EventEmitter) {
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
        };

        await boardRepo.save(board);

        socket.join(`board-${boardId}`);

        callback(boardId);

        emitter.emit('broadcastBoards', [boardId])
      },
    joinBoard: (io: Server, socket: Socket) =>
      async function (boardId: string) {
        // mise a jour de la board
          let board : SavedBoard;
          try {
              board = await boardRepo.findById(boardId);
          } catch (e) {
              console.error(e);
              socket.emit("kickOut")
              return
          }

          // si nouvel utilisateur : mise a jour du board
          if(!board.users.find(uuid => uuid === socket.data.userId)) {
              board.users.push(socket.data.userId);
              await boardRepo.save(board);
          }

        // socket est lié à la board
        socket.join(`board-${boardId}`);

        // toutes les sockets liés à la board sont mise a jour avec le nouvel état
        emitter.emit('broadcastBoards', [boardId])
      },
  };
}
