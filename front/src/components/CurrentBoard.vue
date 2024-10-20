<template>
  <div v-if="board">
    <UsersMenu :users="board.users" class="panel-right-top"></UsersMenu>
    <template v-for="postIt in postIts" :key="postIt.id">
      <PostItComp :data="postIt"></PostItComp>
    </template>

    <div class="board-container" @dblclick.stop="createPostIt">
      vous êtes connectés au board {{ board.uuid }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed} from "vue";
import {useBoardStore} from "../stores/board.ts";
import UsersMenu from "./UsersMenu.vue";
import PostItComp from './PostIt.vue'
import {type PostIt} from "@retro/shared";

const boardStore = useBoardStore();

const board = computed(() => boardStore.board);

const postIts = computed(() => board.value?.components?.filter((c) => c.type === "postIt").map(c => c as unknown as PostIt) || []);

const createPostIt = (event: MouseEvent) => {
  console.log("createPostIt", event);
  const pos: number[] = [(event.pageX-20), (event.pageY-15)];
  boardStore.createPostIt(pos, (id: string) => {
    openEditor(id)
  });
}

const openEditor = (id: string) => {
  console.log("openEditor", id);
}
</script>

<style scoped>
.board-container {
  width: 100vw;
  height: 100vh;
}
</style>
