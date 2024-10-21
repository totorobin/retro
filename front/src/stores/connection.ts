import {defineStore} from "pinia";
import {computed, reactive} from "vue";
import {socket} from "../socket.ts";

export const useConnectionStore = defineStore('connection', () => {
    const state = reactive<{
        connected: boolean,
        firstConnection: boolean,
        credentials: string | null
    }>({
        connected: false,
        firstConnection: true,
        credentials: null
    })

    const bindEvents = () => {
        socket.on('connect', () => {
            console.log(`connected to websocket with id ${socket.id}`)
            state.connected = true
        })

        socket.on("connect_error", (error) => {
            if (socket.active) {
                console.log("socket active", error.message);
                // temporary failure, the socket will automatically try to reconnect
            } else {
                // the connection was denied by the server
                // in that case, `socket.connect()` must be manually called in order to reconnect
                console.log(error.message);
            }
        });

        /** GESTION DE LA RECONNECTION */
        socket.on('disconnect', (reason: string) => {
            state.connected = false
            state.firstConnection = false
            if (reason === 'io server disconnect') {
                socket.auth = {jwt: state.credentials}
                setTimeout(() => socket.connect(), 3000)
            }
        })

    }


    const connect = ({credential, code, access_token}: { [keys: string]: string }) => {
        if (credential) {
            state.credentials = credential
            socket.auth = {jwt: credential}
        } else if (code) {
            socket.auth = {code}
        } else if (access_token) {
            socket.auth = {token: access_token}
        } else {
            return
        }
        socket.connect()
    }
    const disconnect = () => {
        socket.disconnect()
    }

    return {
        bindEvents,
        connect,
        disconnect,
        state,
        loggedIn: computed(() => state.connected === true),
    }
})
