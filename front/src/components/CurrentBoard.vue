<template>
  <div v-if="board" >
    <div class="board-header">
      <button @click="centerView">Recentrer la vue</button>
      <button class="close-overlay-btn" v-if="focusedUser" @click="focusUser(null)">Arrêter le focus</button>
      <button v-if="allowedToCreateArea" @click="createArea()">Ajouter une zone</button>
    </div>

    <div class="board-container">
      <div class="moving-board" ref="draggable" :style="movableView.style.value" @dblclick.stop="createPostIt" :class="{dropZone : isOverDropZone}">
        <template v-for="area in areas" :key="area.id">
          <PictureArea v-if="area.type === 'picture'" :data="area as unknown as Picture"  :board="draggable"  />
          <test-rec v-else-if="area.type === 'area' && ((area as unknown as Area).visible || allowedToCreateArea)" :data="area as unknown as Area" :board="draggable" :class="{ 'user-unfocused' : focusedUser }"/>
        </template>
        <template v-for="postIt in postIts" :key="postIt.id">
          <PostItComp :data="postIt" :board="draggable" :class="{ 'user-unfocused' : focusedUser && postIt.owner !== focusedUser}"></PostItComp>
        </template>
      </div>
    </div>
    <UsersMenu :users="board.users" class="panel-right-top" @focusUser="focusUser"></UsersMenu>
  </div>
</template>

<script lang="ts" setup>
import {computed, nextTick, ref} from "vue";
import {useBoardStore} from "../stores/board.ts";
import UsersMenu from "./UsersMenu.vue";
import PostItComp from './PostIt.vue'
import {type Area, type PostIt, type Picture} from "@retro/shared";
import { useDraggable } from "@vueuse/core";
import {useUserStore} from "../stores/users.ts";
import TestRec from "./testRec.vue";
const userStore = useUserStore()
const boardStore = useBoardStore();
const board = computed(() => boardStore.board);

import { useDropZone } from '@vueuse/core'
import PictureArea from "./PictureArea.vue";

const draggable = ref<HTMLElement | null>(null)
async function onDrop(files: File[] | null, event: MouseEvent) {
  // called when files are dropped on zone
  console.log(files, event)
  if(files){
    let img = new Image()
    let heigth = DEFAULT_AREA_SIZE[1]
    img.src = window.URL.createObjectURL(files[0])
    img.onload = () => {
      heigth = img.height / img.width * DEFAULT_AREA_SIZE[0]
    }
    const formData = new FormData();
    formData.append("file", files[0]);
    const resp = await fetch('/download', {
      method: 'POST',
      body:  formData,
    })
    if(resp.ok){
      const { id } = await resp.json()
      const pos = [
        event.layerX - DEFAULT_AREA_SIZE[0]/2,
        event.layerY - heigth/2,
        event.layerX + DEFAULT_AREA_SIZE[0]/2,
        event.layerY + heigth/2,
      ]
      boardStore.createPicture(pos, id, (areaid: string) => {
        // Area has been created, simulate a click on it to open edition
        console.log('New Picture', areaid, pos)
      })
    } else {
      console.log(resp)
    }
  }
}

const { isOverDropZone } =useDropZone(draggable, {
  onDrop,
  // specify the types of data to be received.
  dataTypes: ['image/jpeg','image/png'],
  // control multi-file drop
  multiple: false,
  // whether to prevent default behavior for unhandled events
  preventDefaultForUnhandled: false,
})
// Move view
const BOARD_SIZE = [10000, 10000] // May be variabilized & sent by the server
const board_size_x = BOARD_SIZE[0] + 'px' // used in CSS below
const board_size_y = BOARD_SIZE[1] + 'px' // used in CSS below
const movableView = useDraggable(draggable, {
  initialValue: {x:-BOARD_SIZE[0]/2, y:-BOARD_SIZE[1]/2},
  capture: false,
  preventDefault: false,
  exact: false,
  stopPropagation: false,
})
const centerView = () => {
  movableView.x.value = -BOARD_SIZE[0]/2
  movableView.y.value = -BOARD_SIZE[0]/2
}

const delay = (ms: any) => new Promise(res => setTimeout(res, ms));

// Post-its
const postIts = computed(() => board.value?.components?.filter((c) => c.type === "postIt").map(c => c as unknown as PostIt) || []);
const createPostIt = (event: MouseEvent) => {
  const pos: number[] = [(event.pageX - movableView.x.value), (event.pageY - movableView.y.value)];
  boardStore.createPostIt(pos, async (id: string) =>  {

      await delay(300)
      console.log("création du post-it", id, document.getElementById(id));
      document.getElementById(id)?.click();
    document.getElementById(id)?.click();
    await nextTick()
    document.getElementById(id)?.focus();

  });
}

// Areas
const areas = computed(() => board.value?.components?.filter(c => c.type !== 'postIt'))

const focusedUser = ref<string | null>(null)
const focusUser = (userId : string | null) => {
  focusedUser.value = userId;
}

const allowedToCreateArea = computed<boolean>(() => userStore.me?.uuid === board.value?.ownerId)
const DEFAULT_AREA_SIZE = [200,100]
const createArea = () => {
  const pos = [
    - movableView.x.value + window.innerWidth/2 - DEFAULT_AREA_SIZE[0]/2,
    - movableView.y.value + window.innerHeight/2 - DEFAULT_AREA_SIZE[1]/2,
   - movableView.x.value +  window.innerWidth/2 + DEFAULT_AREA_SIZE[0]/2,
    - movableView.y.value + window.innerHeight/2 + DEFAULT_AREA_SIZE[1]/2,
  ]
  boardStore.createArea(pos, (areaid: string) => {
    // Area has been created, simulate a click on it to open edition
    console.log('New Area', areaid, pos)
  })
}
</script>

<style scoped>
.dropZone {
  background-color: #7e964b !important;
}
.board-header {
  position: absolute;
  top: 0;
  width: 120px;
  user-select: none;
  translate: calc(50vw - 60px);
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
