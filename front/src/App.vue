<script setup lang="ts">
import { useConnectionStore } from "./stores/connection.ts";
import { socket } from "./socket.ts";
import { useUserStore } from "./stores/users.ts";
import { useRoomStore } from "./stores/room.ts";
import LoginForm from "./components/LoginForm.vue";
import LoggedUser from "./components/LoggedUser.vue";
import { computed } from "vue";
import ReconnectionAlert from "./components/ReconnectionAlert.vue";

const connectionStore = useConnectionStore();
const userStore = useUserStore();
const roomStore = useRoomStore();

// remove any existing listeners (in case of hot reload)
socket.off();

connectionStore.bindEvents();
userStore.bindEvents();
roomStore.bindEvents();

const userLogged = computed(() => userStore.me?.loggedIn);
</script>

<template>
  <LoginForm v-if="!userLogged" />
  <ReconnectionAlert />
  <div class="header"><LoggedUser /></div>
  <div class="main">
    <RouterView />
  </div>
</template>

<style scoped>
.header {
  display: flex;
  flex-direction: row-reverse;
}
</style>
