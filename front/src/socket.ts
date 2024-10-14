import { io, type Socket } from "socket.io-client";
import { ServerToClientEvents, ClientToServerEvents } from "@retro/shared";

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io({
  autoConnect: false,
});
