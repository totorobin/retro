import {defineStore} from "pinia";
import {socket} from "../socket.ts";
import {User} from "@knightmare-chess/shared";
import {ref} from "vue";

export const useUserStore = defineStore('users', () => {

    const users = ref<Array<User>>([])
    const me = ref<User>()

    const bindEvents = () => {
        socket.on('connect', () => {
            if(localStorage.getItem('uuid'))
                login(localStorage.getItem('userName') || undefined)
        })
        socket.on('logged', (_me: User) => {
            console.log('connected', _me)
            localStorage.setItem('uuid', _me.uuid)
            localStorage.setItem('userName', _me.name)
            me.value = _me
        })
        socket.on('players', (_players: Array<User>) => {
            console.log(`connected users`, _players)
            users.value = _players
        })
    }

    /** Gestion de l'utilisateur */
    const login = (userName: string | undefined) => {
        const uuid = me.value?.uuid || localStorage.getItem('uuid') || undefined
        console.log('loging', uuid, userName)
        socket.emit('login', {name: userName, uuid })
    }
    return {
        bindEvents,
        users,
        login,
        me
    }
})