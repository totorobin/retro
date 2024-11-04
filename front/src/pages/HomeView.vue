<template>

  <div class="header">
    <LoggedUser/>
  </div>
  <button @click="createBoard">Create Board</button>
  <MyBoards />
  <div class="panel-right-bottom">
    <ListPlayers/>
  </div>
</template>

<script lang="ts" setup>
import ListPlayers from "../components/ListPlayers.vue";
import {useBoardStore} from "../stores/board.ts";
import {useUserStore} from "../stores/users.ts";
import {computed} from "vue";
import MyBoards from "../components/MyBoards.vue";
import LoggedUser from "../components/LoggedUser.vue";
import ReconnectionAlert from "../components/ReconnectionAlert.vue";

const boardStore = useBoardStore();
const userStore = useUserStore();

const createBoard = () => {
  boardStore.createBoard();
};

</script>

<style scoped>
button {
  margin-top: 10vh;
}
.header {
  display: flex;
  flex-direction: row-reverse;
}
</style>
