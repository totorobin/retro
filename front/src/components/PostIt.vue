<template>

  <OnClickOutside v-if="selected" @trigger="clickOutside">
    <UseDraggable :class="[data.color, $attrs.class]"
                  :initial-value="{ x: data.position[0], y: data.position[1] }"
                  class="post-it selected"
                  contenteditable
                  @blur="onEdit"
                  @end="updatePos"
                  @contextmenu.prevent="showContextMenu($event)"
    >
      {{ text }}
    </UseDraggable>
  </OnClickOutside>
  <div v-else :class="[data.color, $attrs.class]" :style="{left: data.position[0] + 'px', top: data.position[1] +'px'}"
       class="post-it" @mouseover="select">
    {{ data.text }}
  </div>
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

const select = () => {
  if(userStore.me?.uuid === props.data.owner) {
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

.user-focused {
  z-index: 10
}
</style>