<template>
  <UseDraggable :class="[data.color , {'own': own, 'redacted-script-regular': !data.visible && !own }]"
                :initial-value="{ x: data.position[0], y: data.position[1] }"
                class="post-it"
                :contenteditable="own"
                @blur="endEdit"
                @end="updatePos"
                @contextmenu.prevent="showContextMenu($event)"
  >
    {{  hidetext }}
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
import {UseDraggable} from '@vueuse/components'
import {PostIt} from "@retro/shared";
import {ref, computed} from "vue";
import {type Position} from "@vueuse/core"
import {useBoardStore} from "../stores/board.ts";
import ContextMenu from "./ContextMenu.vue";
import { useUserStore } from '../stores/users.ts';

const props = defineProps<{ data: PostIt }>()

const {updatePostIt, deletePostIt} = useBoardStore();
const userStore = useUserStore()
const own = ref(userStore.me?.uuid === props.data.owner)

const updatePos = (position: Position, _event: PointerEvent) => {
  if (props.data.position[0] !== position.x && props.data.position[1] !== position.y) {
    props.data.position = [position.x, position.y]
    updatePostIt(props.data)
  }
}

const endEdit = (evt: FocusEvent & { target: { innerText: string } }) => {
  if (evt.target.innerText !== props.data.text) {
    console.log('edit content',  props.data.text ,  evt.target.innerText)
    props.data.text = evt.target.innerText
    updatePostIt(props.data)
    evt.target.innerText = props.data.text
  }
}

const showMenu = ref(false);
const menuX = ref(0);
const menuY = ref(0);
const contextMenuActions = computed(() =>[
   {label: 'Delete', action: 'delete'},
   {label: props.data.visible ? 'Hide' : 'Show', action: 'toggleVisible'},
]);

const rot13 = (text: string) => text.split('')
    .map(char => char === ' ' ? ' ' : String.fromCharCode(char.charCodeAt(0) + (char.toLowerCase() < 'n' ? 13 : -13)))
    .join('');

const hidetext = computed(() =>  (!props.data.visible && !own.value) ? rot13(props.data.text) : props.data.text);


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
    case 'toggleVisible':
      if(props.data.id) {
        props.data.visible = !props.data.visible;
        updatePostIt(props.data)
      }
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