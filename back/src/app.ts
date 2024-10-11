import {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
  User,
} from "@retro/shared";
import { Server as HttpServer } from "http";
import { Server, ServerOptions } from "socket.io";
import { UserRepository } from "./user/user.repository";
import createUserHandler from "./user/user.handler";
import * as jose from "jose";
import { BoardRepository } from "./board/board.repository";
import createBoardHandler from "./board/board.handler";

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

  const { login, logout } = createUserHandler(components);
  const { newBoard, joinBoard } = createBoardHandler(components);

  io.on("connection", (socket) => {
    console.log(socket.handshake.auth); // prints { token: "abcd" }
    if (socket.handshake.auth) {
      login(io, socket)(generateUserFromJwt(socket.handshake.auth.token));
    }

    socket.on("login", login(io, socket));
    socket.on("newBoard", newBoard(io, socket));
    socket.on("joinBoard", joinBoard(io, socket));
  });

  io.of("/").adapter.on("delete-room", (room: string) => {
    if (room.startsWith("user-")) {
      const userId = room.replace("user-", "");
      console.log(`user ${userId} has disconnected`);
      logout(io)(userId);
    }
  });

  return io;
}

const generateUserFromJwt = (token: string): User => {
  try {
    const claims = jose.decodeJwt(token);

    return {
      uuid: claims.sub,
      name: claims.name,
      picture: claims.picture,
    } as User;
  } catch (e) {
    console.error(e);
    return {} as User;
  }
};
