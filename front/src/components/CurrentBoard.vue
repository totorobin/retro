<template>
  <div v-if="board">
    <UsersMenu class="panel-right-top" :users="boardStore.board?.users"></UsersMenu>
    vous êtes connecter au board {{ board.name }}
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import {useBoardStore} from "../stores/board.ts";
import UsersMenu from "./UsersMenu.vue";

const boardStore = useBoardStore();

const board = computed(() => boardStore.board);
</script>
