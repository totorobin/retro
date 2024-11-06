<template>
  <div class="area-top"
       @click="editable=true"
       :style="{
          left: data.position[0] + 'px',
          top: data.position[1] + 'px',
          width: (data.position[2]-data.position[0]) + 'px',
       }">
    <div class="color-selected" :class="[data.color]" @click="switchColor" ></div>
    <div :contenteditable="own && editable"
         style="width: auto; min-height: 15px;"
         @blur="onTextTitle">{{ data.title  }}</div>
  </div>
  <div class="area-left"
       @click="editable=true"
       :style="{
          left: data.position[0] + 'px',
          top: data.position[1] + 'px',
          width: '3px',
          height: (data.position[3]-data.position[1]) + 'px',
       }"></div>
  <div class="area-right"
       @click="editable=true"
       :style="{
          left: data.position[2]-5 + 'px',
          top: data.position[1] + 'px',
          width: '3px',
          height: (data.position[3]-data.position[1]) + 'px',
       }"></div>
  <div class="area-bottom"
       @click="editable=true"
       :style="{
          left: data.position[0] + 'px',
          top: data.position[3]-5 + 'px',
          width: (data.position[2]-data.position[0]) + 'px',
          height: '3px',
       }"></div>
  <UseDraggable class="dot"
                v-if="editable"
                :style="[ selectedDot !== 'topLeft' ? '' : { left: data.position[0] + 'px', top: data.position[1] + 'px'}]"
                :initial-value="{ x: data.position[0], y: data.position[1] }"
                :containerElement="board"
                @start="selectedDot = 'topLeft'"
                @move="(event) => {data.position[0] = event.x; data.position[1] = event.y; }"
                @end="endmove"
                :capture="true"
  >
    <div><!-- Top Left --></div>
  </UseDraggable>
  <UseDraggable class="dot"
                v-if="editable"
                :style="[ selectedDot !== 'topRight' ? '' : { left: data.position[2] + 'px', top: data.position[1] + 'px'}]"
                :initial-value="{ x: data.position[2], y: data.position[1] }"
                :containerElement="board"
                @start="selectedDot = 'topRight'"
                @move="(event) => {data.position[2] = event.x; data.position[1] = event.y; }"
                @end="endmove"
                :capture="true"
  >
    <div><!-- Top Right --></div>
  </UseDraggable>
  <UseDraggable class="dot"
                v-if="editable"
                :style="[ selectedDot !== 'bottomLeft' ? '' : { left: data.position[0] + 'px', top: data.position[3] + 'px'}]"
                :initial-value="{ x: data.position[0], y: data.position[3] }"
                :containerElement="board"
                @start="selectedDot = 'bottomLeft'"
                @move="(event) => {data.position[0] = event.x; data.position[3] = event.y; }"
                @end="endmove"
                :capture="true"
  >
    <div><!-- Bottom Left --></div>
  </UseDraggable>
  <UseDraggable class="dot"
                v-if="editable"
                :style="[ selectedDot !== 'bottomRight' ? '' : { left: data.position[2] + 'px', top: data.position[3] + 'px'}]"
                :initial-value="{ x: data.position[2], y: data.position[3] }"
                :containerElement="board"
                @start="selectedDot = 'bottomRight'"
                @move="(event) => {data.position[2] = event.x; data.position[3] = event.y; }"
                @end="endmove"
                :capture="true"
  >
    <div><!-- Bottom Right --></div>
  </UseDraggable>
</template>

<script setup lang="ts">
import {Area} from "@retro/shared";
import {type Position, useDraggable} from "@vueuse/core";
import {ref, useTemplateRef} from "vue";
import {UseDraggable} from "@vueuse/components";
import {useBoardStore} from "../stores/board.ts";
import {useUserStore} from "../stores/users.ts";


const props = defineProps<{ data: Area, board: HTMLElement|null }>()
const {updatePostIt} = useBoardStore();

const userStore = useUserStore()
const own = ref(userStore.me?.uuid === props.data.owner)

const editable = ref(false)
const selectedDot = ref<Ref<String | null>>(null)

const endmove = () => {
  selectedDot.value = null
      editable.value = false
  updatePostIt(props.data)
}

const onTextTitle = (evt: FocusEvent & { target: { innerText: string } }) => {
  if (props.data.title !== evt.target.innerText) {
    props.data.title = evt.target.innerText
    updatePostIt({...props.data})
    evt.target.innerText = props.data.text // Fix duplicating text on edit
  }
}

const COLORS = ['yellow', 'red', 'green', 'orange']
const switchColor = () => {
  props.data.color = COLORS[(COLORS.indexOf(props.data.color)+ 1) % 4]
  updatePostIt(props.data)
}
/*
const resizeDotsOrigins = {
  'topLeftDot': [0,1],
  'topRightDot': [0,3],
  'bottomLeftDot': [2,1],
  'bottomRight': [2,3],
}
const resizeDots = {}
for(const dot in resizeDotsOrigins) {
  const ref = useTemplateRef(`${props.data.id}-${dot}`) //ref<HTMLElement | null>(null)
  const draggable = useDraggable(ref, {
    initialValue: {x: props.data.position[resizeDotsOrigins[dot][0]], y: props.data.position[resizeDotsOrigins[dot][0]]},
    exact: true,
    capture: true,
  })
  resizeDots[dot] = draggable
}


const topRightDot = useTemplateRef(`${props.data.id}-topRightDot`) //ref<HTMLElement | null>(null)
const topRightDotDraggable = useDraggable(topRightDot, {
  initialValue: {x: 0, y: 0},
  exact: true,
  capture: true,
})*/

</script>

<style scoped>
.area-top {
  position: absolute;
  border-top: 2px solid var(--border-color);
  display:flex;
  flex-direction: row;
}
.area-left {
  position: absolute;
  border-left: 2px solid var(--border-color);
}
.area-right {
  position: absolute;
  border-right: 2px solid var(--border-color);
}
.area-bottom {
  position: absolute;
  border-bottom: 2px solid var(--border-color);
}
.dot {
  position: absolute;
  cursor: move;
  transform: translate(-50%, -50%); /* center dot on its position */
  div {
    background-color: var(--border-color);
    margin: 15px;
    height: 4px;
    width: 4px;
  }
}
.color-selected {
  margin-left: 20px;
  height: 15px;
  width: 15px;
  border-radius: 15px;
}

.green  {
  background-color: var(--green-post-it);
}
.yellow {
  background-color: var(--yellow-post-it);
}
.orange {
  background-color: var(--orange-post-it);
}
.red {
  background-color: var(--red-post-it);
}
</style>