<template>
  <CurrentBoard />
</template>

<script setup lang="ts">
import CurrentBoard from "../components/CurrentBoard.vue";
import {useBoardStore} from "../stores/board.ts";

const props = defineProps<{boardId: string}>();

const boardStore = useBoardStore();

if(!boardStore.board) {
  boardStore.joinBoard(props.boardId)
}
</script>
