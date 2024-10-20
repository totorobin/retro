import {io, type Socket} from "socket.io-client";
import {ClientToServerEvents, ServerToClientEvents} from "@retro/shared";

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io({
    autoConnect: false,
});
