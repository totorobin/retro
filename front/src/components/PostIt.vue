<template>
  <OnClickOutside @trigger="clickOutside">
    <UseDraggable :class="data.color + ' post-it' + (own ? ' own' : '') + (selected ? ' selected' : '')"
                  :initial-value="{ x: data.position[0], y: data.position[1] }"
                  class="post-it"
                  :contenteditable="own && selected"
                  @blur="onEdit"
                  @end="updatePos"
                  @click="select"
                  :disabled="!own || selected"
                  @contextmenu.prevent="showContextMenu($event)"
    >
      {{ text }}
    </UseDraggable>
  </OnClickOutside>

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
import {OnClickOutside, UseDraggable} from '@vueuse/components'
import {PostIt} from "@retro/shared";
import {ref} from "vue";
import {type Position} from "@vueuse/core"
import {useBoardStore} from "../stores/board.ts";
import ContextMenu from "./ContextMenu.vue";
import { useUserStore } from '../stores/users.ts';

const props = defineProps<{ data: PostIt }>()

const text = ref('')
const {updatePostIt, deletePostIt} = useBoardStore();
const selected = ref(false)
const userStore = useUserStore()
const own = ref(userStore.me?.uuid === props.data.owner)

const select = () => {
  if(own.value) {
    text.value = props.data.text
    selected.value = true
  }
}

const updatePos = (position: Position, _event: PointerEvent) => {
  if (props.data.position[0] !== position.x && props.data.position[1] !== position.y) {
    props.data.position = [position.x, position.y]
    updatePostIt(props.data)
  }
}
const onEdit = (evt: FocusEvent & { target: { innerText: string } }) => {
  text.value = evt.target.innerText
}

const endEdit = () => {
  if (text.value !== props.data.text) {
    console.log(text.value, props.data.text)
    props.data.text = text.value
    updatePostIt({...props.data})
  }
}

const clickOutside = () => {
  selected.value = false;
  endEdit()
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
  position: fixed;
  font-size: smaller;
  width: 100px;
  min-height: 80px; /* Will elongate if too much text */

  padding: .25em; /* Margin between post-it border & text = 1/4 character width */

  /* Borders */
  border: 1px solid #0004;
  margin: -1px; /* compensate for border width */

  /* Manage word break properly */
	overflow-wrap: break-word;

  /* Shadow */
  box-shadow: 0 5px 10px -5px #000;
}

.post-it.own {
  cursor: pointer;
}
.post-it.own:hover {
  border: 1px solid black;
  margin: -1px; /* compensate for border width */
}
.post-it.selected {
  border: 2px solid var(--border-color);
  margin: -2px; /* compensate for border width */
  cursor: unset;
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