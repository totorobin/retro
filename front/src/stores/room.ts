import { defineStore } from "pinia";
import { Room } from "@retro/shared";
import { ref } from "vue";
import { socket } from "../socket.ts";
import router from "../router";

export const useRoomStore = defineStore("room", () => {
  const room = ref<Room>();

  const bindEvents = () => {
    socket.on("room", (_room: Room) => {
      room.value = _room;
    });
  };

  const createRoom = () => {
    socket.emit("newRoom", null, (roomName) => {
      console.log("création de " + roomName);
      router.push("/r/" + roomName);
    });
  };

  const joinRoom = (roomName: string) => {
    socket.emit("joinRoom", roomName);
  };

  return {
    room,
    bindEvents,
    createRoom,
    joinRoom,
  };
});
