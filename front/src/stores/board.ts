import {defineStore} from "pinia";
import {Board, PostIt} from "@retro/shared";
import {ref} from "vue";
import {socket} from "../socket.ts";
import router from "../router";

export const useBoardStore = defineStore("board", () => {
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

    const createPostIt = (pos: number[], callback: (componentId: string) => void) => {
        if (board.value) {
            const component: PostIt = {
                position: pos,
                type: 'postIt',
                text: '',
                color: 'yellow',
                visible: true
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
        if(board.value) {
            console.log('delete component ', id)
            socket.emit('deleteComponent', board.value.uuid, id)
        }
    }

    return {
        board,
        bindEvents,
        createBoard,
        joinBoard,
        createPostIt,
        updatePostIt,
        deletePostIt
    };
});
