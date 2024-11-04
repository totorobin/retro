<template>
  <board-menu/>
  <CurrentBoard/>
</template>

<script lang="ts" setup>
import CurrentBoard from "../components/CurrentBoard.vue";
import {useBoardStore} from "../stores/board.ts";
import BoardMenu from "../components/BoardMenu.vue";
import {onBeforeRouteLeave} from "vue-router";

defineProps<{ boardId: string }>();


onBeforeRouteLeave((to, from, next) => {
  console.log("beforeRouteLeave", to, from);
  const boardStore = useBoardStore();
  boardStore.leaveBoard()
  next()
})
</script>
