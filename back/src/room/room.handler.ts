import { v4 as uuid } from "uuid";
import { Components } from "../app";
import { Server, Socket } from "socket.io";
import { Room } from "@retro/shared";

export default function ({ userRepo, roomRepo }: Components) {
  return {
    newRoom: (io: Server, socket: Socket) =>
      async function (
        roomName: string | null,
        callback: (roomName: string) => void
      ) {
        if (!roomName) {
          roomName = uuid();
        }

        const room: Room = {
          name: roomName,
          users: [await userRepo.findById(socket.data.userId)],
        };

        await roomRepo.save(room);

        socket.join(`room-${roomName}`);

        callback(roomName);

        io.to(`room-${roomName}`).emit("room", room);
      },
    joinRoom: (io: Server, socket: Socket) =>
      async function (roomName: string) {
        // mise a jour de la room
        const room = await roomRepo.findById(roomName);
        room.users.add(await userRepo.findById(socket.data.userId));
        await roomRepo.save(room);

        // socket est lié à la room
        socket.join(`room-${roomName}`);

        // toutes les sockets liés à la room sont mise a jour avec le nouvel état
        io.to(`room-${roomName}`).emit("room", room);
      },
  };
}
