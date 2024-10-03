<script setup lang="ts">
import {useConnectionStore} from "./stores/connection.ts";
import {socket} from "./socket.ts";
import {useUserStore} from "./stores/users.ts";
import LoginForm from "./components/LoginForm.vue";
import ListPlayers from "./components/ListPlayers.vue";
import LoggedUser from "./components/LoggedUser.vue";
import {computed} from "vue";
import ReconnectionAlert from "./components/ReconnectionAlert.vue";

const connectionStore = useConnectionStore()
const userStore = useUserStore()

// remove any existing listeners (in case of hot reload)
socket.off()

connectionStore.bindEvents()
userStore.bindEvents()

const userLogged = computed(() => userStore.me?.loggedIn )
</script>

<template>
  <LoginForm v-if="!userLogged"/>
  <ReconnectionAlert />
  <div class="header"><LoggedUser /></div>
  <div class="main">
    <div>
      <a href="https://vitejs.dev" target="_blank">
        <img src="/vite.svg" class="logo" alt="Vite logo" />
      </a>
      <a href="https://vuejs.org/" target="_blank">
        <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
      </a>
    </div>
    <ListPlayers />
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
.header {
  display: flex;
  flex-direction: row-reverse;
}
</style>
