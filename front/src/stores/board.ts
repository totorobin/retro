import { defineStore } from "pinia";
import { Board } from "@retro/shared";
import { ref } from "vue";
import { socket } from "../socket.ts";
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

  return {
    board,
    bindEvents,
    createBoard,
    joinBoard,
  };
});
