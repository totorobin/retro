<template>
  <UseDraggable class="post-it"
                :class="[data.color, {own, editing}]"
                :initial-value="{ x: data.position[0], y: data.position[1] }"
                @drag="onDrag"
                @contextmenu.prevent="showContextMenu($event)"
                :disabled="!own || editing"
                @end="onDrop"
                :capture="true"
                :containerElement="board"
  >
    <OnClickOutside @trigger="onClickOutside">
      <div class="inpostit"
                  :contenteditable="own && editing"
                  @click="onClick"
                  @blur="onTextChange"
      >
        {{ data.text }}
      </div>
    </onClickOutside>
  </UseDraggable>

  <div v-if="showMenu" class="overlay" @click="closeContextMenu"/>
  <ContextMenu
      v-if="showMenu"
      :actions="contextMenuActions"
      :x="menuX"
      :y="menuY"
      style="z-index: 50"
      @action-clicked="handleActionClick"
  />

</template>

<script lang="ts" setup>
import {UseDraggable, OnClickOutside} from '@vueuse/components'
import {PostIt} from "@retro/shared";
import {ref} from "vue";
import {type Position} from "@vueuse/core"
import {useBoardStore} from "../stores/board.ts";
import ContextMenu from "./ContextMenu.vue";
import { useUserStore } from '../stores/users.ts';

const props = defineProps<{ data: PostIt, board: HTMLElement|null }>()

const {updatePostIt, deletePostIt} = useBoardStore();
const editing = ref(false)
const dragging = ref(false)
const userStore = useUserStore()
const own = ref(userStore.me?.uuid === props.data.owner)


const onDrag = () => {
  dragging.value = true
  editing.value = false
}
const onDrop = (position: Position, _event: PointerEvent) => {
  if (props.data.position[0] !== position.x && props.data.position[1] !== position.y) {
    props.data.position = [position.x, position.y]
    updatePostIt(props.data)
  }
  setTimeout(() => {dragging.value = false}, 100) // Delay to prevent onClick to trigger
}


const onClick = () => {
  if(!dragging.value) {
    editing.value = true
  }
}
const onTextChange = (evt: FocusEvent & { target: { innerText: string } }) => {
  if (props.data.text !== evt.target.innerText) {
    console.log("endEdit: " + props.data.text + " <- " + evt.target.innerText)
    props.data.text = evt.target.innerText
    updatePostIt({...props.data})
    evt.target.innerText = props.data.text // Fix duplicating text on edit
  }
  editing.value = false
}
const onClickOutside = () => {
  editing.value = false
}

const showMenu = ref(false);
const menuX = ref(0);
const menuY = ref(0);
const contextMenuActions = [
  {label: 'Delete', action: 'delete'},
];

const showContextMenu = (event: PointerEvent) => {
  event.preventDefault();
  showMenu.value = true;
  menuX.value = event.clientX;
  menuY.value = event.clientY;
};

const closeContextMenu = () => {
  showMenu.value = false;
};

const handleActionClick = (action: string) => {
  switch (action) {
    case 'delete':
      if (props.data.id)
        deletePostIt(props.data.id)
      break;
  }
  showMenu.value = false;
}
</script>

<style scoped>
.post-it {
  position: absolute;
  padding: .33em; /* Margin between post-it border & text = 1/4 character width */

  /* Borders */
  border: 1px solid #0004;
  margin: -1px; /* compensate for border width */

  /* Shadow */
  box-shadow: 0 5px 10px -5px #000;
}
.post-it.own {
  cursor: grab;
}
.post-it.own:hover:not(.editing) {
  border: 1px solid black;
  margin: -1px; /* compensate for border width */
}
.post-it.editing {
  border: 1px dashed var(--border-color);
  margin: -1px; /* compensate for border width */
}

.inpostit {
  width: 100px;
  min-height: 80px; /* Will elongate if too much text */
  font-size: smaller;

  /* Manage word break properly */
  overflow-wrap: break-word;
  border-radius: 1em; /* easier to dragndrop from corners */
}
.post-it.editing .inpostit[contenteditable] {
  outline: 0px solid transparent;
  cursor: text;
}
.post-it:active {
  cursor: grabbing;
}

.yellow {
  background-color: var(--yellow-post-it);
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: transparent;
  z-index: 49;
}

.overlay::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
}

.overlay:hover {
  cursor: pointer;
}
</style>