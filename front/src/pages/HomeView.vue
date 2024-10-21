<template>
  <button @click="createBoard">Create Board</button>
  <MyBoards v-model="boards" />
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

const boardStore = useBoardStore();
const userStore = useUserStore();

const createBoard = () => {
  boardStore.createBoard();
};
const boards = computed(() => userStore.myBoards);

</script>

<style scoped>
button {
  margin-top: 10vh;
}
</style>
