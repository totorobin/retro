import { io , type Socket } from 'socket.io-client'
import {ServerToClientEvents, ClientToServerEvents } from '@knightmare-chess/shared'


export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io({
    autoConnect: false,
})
