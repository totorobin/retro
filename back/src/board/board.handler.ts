import { v4 as uuid } from "uuid";
import { Components } from "../app";
import { Server, Socket } from "socket.io";
import { Board } from "@retro/shared";

export default function ({ userRepo, boardRepo }: Components) {
  return {
    newBoard: (io: Server, socket: Socket) =>
      async function (
        boardId: string | null,
        callback: (boardName: string) => void
      ) {
        if (!boardId) {
          boardId = uuid();
        }

        const board: Board = {
          name: boardId,
          users: [await userRepo.findById(socket.data.userId)],
        };

        await boardRepo.save(board);

        socket.join(`board-${boardId}`);

        callback(boardId);

        io.to(`board-${boardId}`).emit("board", board);
      },
    joinBoard: (io: Server, socket: Socket) =>
      async function (boardId: string) {
        // mise a jour de la board
          let board : Board;
          try {
              board = await boardRepo.findById(boardId);
          } catch (e) {
              console.error(e);
              socket.emit("kickOut")
              return
          }

          // si nouvel utilisateur : mise a jour du board
          if(!board.users.find(u => u.uuid === socket.data.userId)) {
              board.users.push(await userRepo.findById(socket.data.userId));
              await boardRepo.save(board);
          }

        // socket est lié à la board
        socket.join(`board-${boardId}`);

        // toutes les sockets liés à la board sont mise a jour avec le nouvel état
        io.to(`board-${boardId}`).emit("board", board);
      },
  };
}
