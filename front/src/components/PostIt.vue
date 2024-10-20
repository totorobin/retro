<template>
  <OnClickOutside  v-if="selected" @trigger="clickOutside" >
    <UseDraggable :initial-value="{ x: data.position[0], y: data.position[1] }"
                  :class="data.color"
                  class="post-it selected"
                  @end="updatePos"
                  contenteditable
                  @blur="onEdit"
                  @contextmenu.prevent="showContextMenu($event)"
    >
      {{ text }}
   </UseDraggable>
  </OnClickOutside>
    <div v-else :style="{left: data.position[0] + 'px', top: data.position[1] +'px'}"  :class="data.color"
         @click="select" class="post-it">
          {{ data.text }}
    </div>

  <div class="overlay" @click="closeContextMenu" v-if="showMenu" />
  <ContextMenu
      v-if="showMenu"
      :actions="contextMenuActions"
      @action-clicked="handleActionClick"
      :x="menuX"
      :y="menuY"
      style="z-index: 50"
  />

</template>

<script lang="ts" setup>
import { UseDraggable, OnClickOutside } from '@vueuse/components'
import {PostIt} from "@retro/shared";
import {ref} from "vue";
import {type Position} from "@vueuse/core"
import { useBoardStore} from "../stores/board.ts";
import ContextMenu from "./ContextMenu.vue";

const props = defineProps<{ data: PostIt }>()

const text = ref('')
const { updatePostIt , deletePostIt } = useBoardStore();
const selected = ref(false)

const select = () => {
  text.value = props.data.text
  selected.value = true
}

const updatePos = (position: Position, _event: PointerEvent) => {
 if(props.data.position[0] !== position.x && props.data.position[1] !== position.y) {
   props.data.position = [position.x, position.y]
   updatePostIt(props.data)
 }
}
const onEdit = (evt: FocusEvent & { target : { innerText: string}}) => {
  text.value = evt.target.innerText
}

const endEdit = () => {
  if(text.value !== props.data.text) {
    console.log(text.value, props.data.text)
    props.data.text = text.value
    updatePostIt({ ...props.data })
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
  { label: 'Delete', action: 'delete' },
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
      if(props.data.id)
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
  height: 80px;
  border: 1px solid var(--background-color);
}
.post-it.selected {
  border: 1px solid var(--border-color);
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