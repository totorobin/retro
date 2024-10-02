<template>
  <div class="full-screen">
    <div>
      <div>Saisissez votre nom</div>
      <input v-model="name" pw-id="loginform-username-input"/>
      <button @click="login" pw-id="loginform-validate">login</button>
    </div>
  </div>
</template>
<script setup lang="ts">

import {useUserStore} from "../stores/users.ts";
import { ref} from "vue";

const userStore = useUserStore()
const name = ref<string>( userStore.me?.name || '')
const login = () => {
  userStore.login(name.value)
}
</script>
<style lang="css">
.full-screen {
  position: fixed;
  place-items: center;
  min-width: 100vw;
  min-height: 100vh;
  background-color: #242424;
  z-index: 100;
  padding-top: 30%;
}
</style>