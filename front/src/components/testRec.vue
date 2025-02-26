<script setup lang="ts">

import ResizableRectangle from "./ResizableRectangle.vue";
import {Area} from "@retro/shared";
import {useBoardStore} from "../stores/board.ts";
import {useUserStore} from "../stores/users.ts";
import {computed, ref} from "vue";
import {faEye, faEyeSlash, faTrash} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {faEye as farEye, faEyeSlash as farEyeSlash} from "@fortawesome/free-regular-svg-icons";


const props = defineProps<{ data: Area, board: HTMLElement|null }>()
const {updateComponent, deleteComponent} = useBoardStore();

const userStore = useUserStore()
const own = ref(userStore.me?.uuid === props.data.owner)

const width = computed( () => props.data.position[2] - props.data.position[0])
const heigth = computed(() => props.data.position[3] - props.data.position[1])
const updatePositions = (top, left, width, height) => {
  props.data.position = [left, top, left+width, top+height]
  updateComponent(props.data)
}


const onTextTitle = (evt: FocusEvent & { target: { innerText: string } }) => {
  if (props.data.title !== evt.target.innerText) {
    props.data.title = evt.target.innerText
    updateComponent(props.data)
    evt.target.innerText = props.data.title // Fix duplicating text on edit
  }
}
const removeArea = () => {
  if(own.value && props.data.id){
    deleteComponent(props.data.id)
  }
}
const COLORS = ['', 'yellow', 'red', 'green', 'orange', 'blue']
const switchColor = () => {
  props.data.color = COLORS[(COLORS.indexOf(props.data.color)+ 1) % COLORS.length]
  updateComponent(props.data)
}
const toggleForceVisibility = () => {
  //switch between 'null', 'false' or 'true'
  props.data.forceVisiblility = props.data.forceVisiblility == null ? false : ( props.data.forceVisiblility ? null: true)
  updateComponent(props.data)
}
const showHideArea = () => {
  props.data.visible = !props.data.visible
  updateComponent(props.data)
}
</script>

<template>
  <ResizableRectangle style="border: 1px solid var(--border-color);" :containter-element="board" :top="data.position[1]" :left="data.position[0]" :width="width" :height="heigth" :editable="own" @end="updatePositions" >
    <div id="header-area" :class="[$attrs.class, { editable }]" @mouseover="setDraggable">
      <div class="color-selected" :class="[data.color]" @click.self.stop="switchColor" title="choose color" ></div>
      <font-awesome-icon v-if="own" :icon="data.forceVisiblility ? faEye : faEyeSlash" :style="{ opacity : data.forceVisiblility == null ? '0.5' : '1'}" @click.self.stop="toggleForceVisibility" title="toggle Post-it visibility" class="clickable"/>
      <div class="title" :contenteditable="own" @click.stop
           @blur="onTextTitle">{{ data.title  }}</div>
    </div>
    <template #options>
      <font-awesome-icon :icon="data.visible ? farEye : farEyeSlash" style="cursor: pointer" @click.stop="showHideArea" title="toggle Area visibility"/>
      <font-awesome-icon :icon="faTrash" style="cursor: pointer"  @click.stop="removeArea"/>
    </template>
  </ResizableRectangle>
</template>


<style scoped>

#header-area {
  display:flex;
  flex-direction: row;
  gap: 5px;
  padding: 10px 10px;
  line-height: 15px;
  text-align: center;
  vertical-align: center;
  width: calc(100% - 20px); /* 100% - 2x padding */
  .title {
    cursor: text;
    border-radius: 2px;
    width: 10em;
    min-width: 3em;
    min-height: 1em;
    padding: 2px 5px;
    text-align: left;
  }
}

.clickable {
  cursor: pointer;
}
.color-selected {
  height: 15px;
  width: 15px;
  border-radius: 15px;
  background: linear-gradient(145deg, #FFF 0%, #FFF 40%, #F00 50%, #FFF 60%, #FFF 100%);
  cursor: pointer;
}

.color-selected.green  {
  background: unset;
  background-color: var(--green-post-it);
}
.color-selected.yellow {
  background: unset;
  background-color: var(--yellow-post-it);
}
.color-selected.orange {
  background: unset;
  background-color: var(--orange-post-it);
}
.color-selected.red {
  background: unset;
  background-color: var(--red-post-it);
}
.color-selected.blue {
  background: unset;
  background-color: var(--blue-post-it);
}

.title:hover {
  background: #8884;
}

.user-unfocused {
  filter: blur(2px) grayscale(50%)
}
</style>