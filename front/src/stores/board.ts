import {defineStore} from "pinia";
import {Board, PostIt} from "@retro/shared";
import {ref} from "vue";
import {socket} from "../socket.ts";
import {useRouter} from "vue-router";

export const useBoardStore = defineStore("board", () => {
    const router = useRouter();
    const board = ref<Board>();

    const bindEvents = () => {
        socket.on("board", (_board: Board) => {
            board.value = _board;
        });
        socket.on("kickOut", () => {
            router.push("/");
        })
    };

    const createBoard = () => {
        socket.emit("newBoard", null, (boardId) => {
            console.log("création de " + boardId);
            router.push("/r/" + boardId);
        });
    };

    const joinBoard = (boardId: string) => {
        socket.emit("joinBoard", boardId);
    };

    const leaveBoard = () => {
        console.log("leave board", board.value?.uuid);
        if (board.value?.uuid) {
            socket.emit("leaveBoard", board.value?.uuid);
            board.value = null;
        }

    }

    const createPostIt = (pos: number[], callback: (componentId: string) => void) => {
        if (board.value) {
            const component: PostIt = {
                position: pos,
                type: 'postIt',
                text: '',
                color: 'yellow',
                visible: false
            }
            socket.emit('addComponent', board.value.uuid, component, callback)
        }
    }

    const updatePostIt = (component: PostIt) => {
        if (board.value) {
            socket.emit('updateComponent', board.value.uuid, component)
        }
    }

    const deletePostIt = (id: string) => {
        if (board.value) {
            console.log('delete component ', id)
            socket.emit('deleteComponent', board.value.uuid, id)
        }
    }


    return {
        board,
        bindEvents,
        createBoard,
        joinBoard,
        leaveBoard,
        createPostIt,
        updatePostIt,
        deletePostIt
    };
});
