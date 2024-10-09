import { io , type Socket } from 'socket.io-client'
import {ServerToClientEvents, ClientToServerEvents } from '@retro


export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io({
    autoConnect: false,
})
