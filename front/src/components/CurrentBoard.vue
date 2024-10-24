<template>
  <div v-if="board">
    <template v-for="postIt in postIts" :key="postIt.id" >
      <PostItComp :data="postIt" :class="{ 'user-focused' : postIt.owner == focusedUser}" ></PostItComp>
    </template>
    <div class="board-container" @dblclick.stop="createPostIt">
    </div>
    <OverlayFocus v-if="focusedUser" closing-text="Supprimer le focus" @close="focusUser(null)"></OverlayFocus>
    <UsersMenu :users="board.users" class="panel-right-top" @focusUser="focusUser"></UsersMenu>
  </div>
</template>

<script lang="ts" setup>
import {computed, ref} from "vue";
import {useBoardStore} from "../stores/board.ts";
import UsersMenu from "./UsersMenu.vue";
import PostItComp from './PostIt.vue'
import {type PostIt} from "@retro/shared";
import OverlayFocus from "./OverlayFocus.vue";

const boardStore = useBoardStore();

const board = computed(() => boardStore.board);

const postIts = computed(() => board.value?.components?.filter((c) => c.type === "postIt").map(c => c as unknown as PostIt) || []);

const createPostIt = (event: MouseEvent) => {
  const pos: number[] = [(event.pageX - 20), (event.pageY - 15)];
  boardStore.createPostIt(pos, (id: string) => {
    console.log("création du post-it", id);
  });
}

const focusedUser = ref<string | null>(null)
const focusUser = (userId : string | null) => {
  focusedUser.value = userId;
}
</script>

<style scoped>
.board-container {
  width: 100vw;
  height: 100vh;
}
</style>
