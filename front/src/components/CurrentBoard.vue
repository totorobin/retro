<template>
  <div v-if="board">
    <UsersMenu :users="board.users" class="panel-right-top"></UsersMenu>
    
    <div class="board-header">
      Vous êtes connectés au board {{ board.uuid }}
      <button @click="centerView">Recentrer la vue</button>
    </div>

    <div class="board-container" @dblclick.stop="createPostIt">
      <div class="moving-board" ref="draggable" :style="movableView.style.value">
        <template v-for="postIt in postIts" :key="postIt.id">
          <PostItComp :data="postIt" :board="draggable" :class="{ 'user-focused' : postIt.owner == focusedUser}"></PostItComp>
        </template>
      </div>
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
import { useDraggable } from "@vueuse/core";
import OverlayFocus from "./OverlayFocus.vue";

const boardStore = useBoardStore();
const board = computed(() => boardStore.board);


// Move view
const BOARD_SIZE = [10000, 10000] // May be variabilized & sent by the server
const board_size_x = BOARD_SIZE[0] + 'px'
const board_size_y = BOARD_SIZE[1] + 'px'
const draggable = ref<HTMLElement | null>(null)
const movableView = useDraggable(draggable, {
  initialValue: {x:-BOARD_SIZE[0]/2, y:-BOARD_SIZE[1]/2},
  exact: true,
  capture: true,
})
const centerView = () => {
  movableView.x.value = -BOARD_SIZE[0]/2
  movableView.y.value = -BOARD_SIZE[0]/2
}

// Post-its
const postIts = computed(() => board.value?.components?.filter((c) => c.type === "postIt").map(c => c as unknown as PostIt) || []);
const createPostIt = (event: MouseEvent) => {
  const pos: number[] = [(event.pageX - movableView.x.value - 20), (event.pageY - movableView.y.value - 15)];
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
.board-header {
  position: absolute;
  top: 0;
  width: 100vw;
  user-select: none;
}
.board-container {
  position: absolute;
  background-color: var(--outside-board-color);
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  margin: 0;
  padding: 0;
  z-index: -1;
}
.moving-board {
  position: absolute;
  width: v-bind('board_size_x');
  height: v-bind('board_size_y');
  background: var(--background-color);
}
.moving-board:active {
  cursor: move;
}
</style>
