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
import MyBoards from "../components/MyBoards.vue";
import LoggedUser from "../components/LoggedUser.vue";

const boardStore = useBoardStore();

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
