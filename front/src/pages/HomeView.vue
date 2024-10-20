<template>
  <button @click="createBoard">Create Board</button>
  <div class="panel-right-bottom">
    <ListPlayers/>
  </div>
</template>

<script lang="ts" setup>
import ListPlayers from "../components/ListPlayers.vue";
import {useBoardStore} from "../stores/board.ts";

const boardStore = useBoardStore();

const createBoard = () => {
  boardStore.createBoard();
};
</script>

<style scoped>
button {
  margin-top: 10vh;
}
</style>
