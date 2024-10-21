import {defineStore} from "pinia";
import {socket} from "../socket.ts";
import {User, Board} from "@retro/shared";
import {ref} from "vue";

export const useUserStore = defineStore("users", () => {
    const users = ref<Array<User>>([]);
    const me = ref<User>();
    const myBoards = ref<Board[]>([]);

    const bindEvents = () => {
        socket.on("logged", (_me: User) => {
            me.value = _me;
        });
        socket.on("players", (_players: Array<User>) => {
            console.log(`connected users`, _players);
            users.value = _players;
        });
        socket.on("boards", (_boards: Board[]) => {
            console.log('boards', _boards);
            myBoards.value = _boards;
        })
    };
    return {
        bindEvents,
        users,
        me,
        myBoards
    };
});
