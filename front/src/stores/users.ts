import {defineStore} from "pinia";
import {socket} from "../socket.ts";
import {SavedBoard, User} from "@retro/shared";
import {ref} from "vue";

export const useUserStore = defineStore("users", () => {
    const users = ref<Array<User>>([]);
    const me = ref<User>();

    const bindEvents = () => {
        socket.on("logged", (_me: User) => {
            me.value = _me;
        });
        socket.on("players", (_players: Array<User>) => {
            console.log(`connected users`, _players);
            users.value = _players;
        });
    };

    const myBoards = () => {
        console.log("asked for Boards");
        return new Promise<SavedBoard[]>((resolve) => socket.emit("myBoards", (myBoards: Array<SavedBoard>) => {
            console.log("myBoards", myBoards);
            resolve(myBoards);
        }));
    }

    return {
        bindEvents,
        users,
        me,
        myBoards
    };
});
