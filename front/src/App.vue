<script setup lang="ts">
import { useConnectionStore } from "./stores/connection.ts";
import { socket } from "./socket.ts";
import { useUserStore } from "./stores/users.ts";
import { useBoardStore } from "./stores/board.ts";
import LoginForm from "./components/LoginForm.vue";
import LoggedUser from "./components/LoggedUser.vue";
import ReconnectionAlert from "./components/ReconnectionAlert.vue";
import { ref } from 'vue'

const connectionStore = useConnectionStore();
const userStore = useUserStore();
const roomStore = useBoardStore();

// remove any existing listeners (in case of hot reload)
socket.off();

connectionStore.bindEvents();
userStore.bindEvents();
roomStore.bindEvents();


</script>

<template>
  <div>
    <LoginForm v-if="!connectionStore.loggedIn" />
    <div v-else-if="!connectionStore.state.connected && connectionStore.state.firstConnection">
      Connecting
    </div>
    <div v-else>
      <ReconnectionAlert />
      <div class="header"><LoggedUser /></div>
      <div class="main">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<style scoped>
.header {
  display: flex;
  flex-direction: row-reverse;
}
</style>
