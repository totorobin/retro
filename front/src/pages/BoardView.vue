<template>
  <board-menu/>
  <CurrentBoard/>
</template>

<script lang="ts" setup>
import CurrentBoard from "../components/CurrentBoard.vue";
import {useBoardStore} from "../stores/board.ts";
import BoardMenu from "../components/BoardMenu.vue";
import {onBeforeRouteLeave , useRoute } from "vue-router";

defineProps<{ boardId: string }>();

const {joinBoard} = useBoardStore();
const route = useRoute();
joinBoard(route.params.boardId);

onBeforeRouteLeave((to, from, next) => {
  console.log("beforeRouteLeave", to, from);
  const {leaveBoard} = useBoardStore();
  leaveBoard()
  next()
})
</script>
