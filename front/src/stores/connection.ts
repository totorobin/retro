import {defineStore} from "pinia";
import {reactive} from "vue";
import {socket} from "../socket.ts";

export const useConnectionStore = defineStore('connection', () => {
    const state = reactive({
        connected: false,
        firstConnection: true,
    })

    const bindEvents = () => {
        socket.on('connect', () => {
            console.log(`connected to websocket with id ${socket.id}`)
            state.connected = true
        })

        /** GESTION DE LA RECONNECTION */
        socket.on('disconnect', (reason: string) => {
            state.firstConnection = false
            if (reason === 'io server disconnect') {
                // the disconnection was initiated by the server, you need to reconnect manually
                setTimeout(() => socket.connect(), 3000)
            }
        })

    }


    const connect = () => {
        socket.connect()
    }
    const disconnect = () => {
        socket.disconnect()
    }

    connect()

    return {
        bindEvents,
        connect,
        disconnect,
    }
})
