<template>
  <div v-if="board">
    {{ board }}
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import {useBoardStore} from "../stores/board.ts";

const boardStore = useBoardStore();

const board = computed(() => boardStore.board);
</script>
