import {defineStore} from "pinia";
import {socket} from "../socket.ts";
import {User} from "@knightmare-chess/shared";
import {ref} from "vue";

export const useUserStore = defineStore('users', () => {

    const users = ref<Array<User>>([])
    const me = ref<User>()

    const bindEvents = () => {
        socket.on('logged', (_me: User) => {
            me.value = _me
        })
        socket.on('players', (_players: Array<User>) => {
            console.log(`connected users`, _players)
            users.value = _players
        })
    }
    return {
        bindEvents,
        users,
        me
    }
})