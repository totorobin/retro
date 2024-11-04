<script setup lang="ts">
import {ref} from "vue";
import { useRouter } from 'vue-router'
import { googleLogout } from "vue3-google-login"
import { useConnectionStore } from "../stores/connection.ts"
const menuVisible = ref(false);

const toggleMenu = () => {
  menuVisible.value = !menuVisible.value;
}

const router = useRouter();
const home = () => {
  router.push('/')
}

const { disconnect } = useConnectionStore();
const logout = () => {
  googleLogout()
  disconnect()
}
</script>

<template>
  <div class="panel-top-right button-menu">
    <div id="nav-icon1" @click="toggleMenu" :class="{open: menuVisible}">
      <span></span>
      <span></span>
      <span></span>
    </div>
  </div>
  <template v-if="menuVisible">
    <div class="overlay" @click="toggleMenu"/>
    <menu class="panel-top-right">
      <li @click="home">Home</li>
      <li @click="logout">Déconnexion</li>
    </menu>
  </template>
</template>

<style scoped>
.button-menu {
  padding: 10px;
  padding-bottom: 8px;
  background-color: var(--background-color-dark);
  height: fit-content;
  box-shadow: -2px 2px 2px rgba(0, 0, 0, 0.2);
}
menu {
  margin-top: 0;
  margin-right: 52px;
  padding: 3px;
  text-align: left;
  background-color: var(--background-color-dark);
  box-shadow: -2px 2px 2px rgba(0, 0, 0, 0.2);
  min-width: 20px;
  display: inline-grid;
  height: fit-content;
  z-index: 25;
}

menu li {
  padding: 5px;
  cursor: pointer;
  display: inline-flex;
}
menu li:hover {
  background-color: var(--primary-color);
  color: var(--background-color-dark);
}


/* Icon 1 */

#nav-icon1 {
  width: 30px;
  height: 30px;
  position: relative;
  -webkit-transform: rotate(0deg);
  -moz-transform: rotate(0deg);
  -o-transform: rotate(0deg);
  transform: rotate(0deg);
  -webkit-transition: .5s ease-in-out;
  -moz-transition: .5s ease-in-out;
  -o-transition: .5s ease-in-out;
  transition: .5s ease-in-out;
  cursor: pointer;
}

#nav-icon1 span, #nav-icon3 span, #nav-icon4 span {
  display: block;
  position: absolute;
  height: 5px;
  width: 100%;
  background: var(--primary-color);
  border-radius: 5px;
  opacity: 1;
  left: 0;
  -webkit-transform: rotate(0deg);
  -moz-transform: rotate(0deg);
  -o-transform: rotate(0deg);
  transform: rotate(0deg);
  -webkit-transition: .25s ease-in-out;
  -moz-transition: .25s ease-in-out;
  -o-transition: .25s ease-in-out;
  transition: .25s ease-in-out;
}

#nav-icon1 span:nth-child(1) {
  top: 0px;
}

#nav-icon1 span:nth-child(2) {
  top: 10px;
}

#nav-icon1 span:nth-child(3) {
  top: 20px;
}

#nav-icon1.open span:nth-child(1) {
  top: 10px;
  -webkit-transform: rotate(135deg);
  -moz-transform: rotate(135deg);
  -o-transform: rotate(135deg);
  transform: rotate(135deg);
}

#nav-icon1.open span:nth-child(2) {
  opacity: 0;
  left: -30px;
}

#nav-icon1.open span:nth-child(3) {
  top: 10px;
  -webkit-transform: rotate(-135deg);
  -moz-transform: rotate(-135deg);
  -o-transform: rotate(-135deg);
  transform: rotate(-135deg);
}

</style>