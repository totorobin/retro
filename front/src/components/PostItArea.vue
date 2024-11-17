<template>
  <OnClickOutside :options="{ ignore: [/* ... */] }" @trigger="editable = false">
  <div class="border"
       @click="editable=own"
       :style="{
          left: data.position[0] + 'px',
          top: data.position[1] + 'px',
          width: (data.position[2]-data.position[0]) + 'px',
       }">
    <div id="area-top" :class="[$attrs.class, { editable }]"
         @mouseover="setDraggable"
    ></div>
    <div id="header-area" :class="[$attrs.class, { editable }]" @mouseover="setDraggable">
      <div class="color-selected" :class="[data.color]" @click="switchColor" title="choose color" ></div>
      <font-awesome-icon v-if="own" :icon="data.forceVisiblility ? faEye : faEyeSlash" :style="{ opacity : data.forceVisiblility == null ? '0.5' : '1'}" @click="toggleForceVisibility" title="toggle Post-it visibility"/>
      <font-awesome-icon v-if="editable" :icon="data.visible ? farEye : farEyeSlash" style="" @click="showHideArea" title="toggle Area visibility"/>
      <font-awesome-icon v-if="editable" :icon="faTrash" style="" @click="removeArea"/>
      <div class="title" :contenteditable="own && editable"
           style="min-width: 30px; min-height: 15px; padding-left: 5px;"
           @blur="onTextTitle">{{ data.title  }}</div>
    </div>
  </div>
  <div id="area-left" :class="[$attrs.class, { editable }]"
       class="border"
       @mouseover="setDraggable"
       @click="editable=own"
       :style="{
          left: data.position[0] + 'px',
          top: data.position[1] + 'px',
          width: '3px',
          height: (data.position[3]-data.position[1]) + 'px',
       }"></div>
  <div id="area-right" :class="[$attrs.class, { editable }]"
       class="border"
       @mouseover="setDraggable"
       @click="editable=own"
       :style="{
          left: data.position[2]-5 + 'px',
          top: data.position[1] + 'px',
          width: '3px',
          height: (data.position[3]-data.position[1]) + 'px',
       }"></div>
  <div id="area-bottom" :class="[$attrs.class, { editable }]"
       class="border"
       @mouseover="setDraggable"
       @click="editable=own"
       :style="{
          left: data.position[0] + 'px',
          top: data.position[3]-5 + 'px',
          width: (data.position[2]-data.position[0]) + 'px',
          height: '3px',
       }"></div>
  <div id="area-top-left" :class="[$attrs.class, { editable }]"
       class="border"
       @mouseover="setDraggable"
       @click="editable=own"
       :style="{
          left: data.position[0] + 'px',
          top: data.position[1] + 'px',
          width: '15px',
          height: '15px',
       }"></div>
    <div id="area-top-right" :class="[$attrs.class, { editable }]"
         class="border"
         @mouseover="setDraggable"
         @click="editable=own"
         :style="{
          left: data.position[2] - 15 + 'px',
          top: data.position[1] + 'px',
          width: '15px',
          height: '15px',
       }"></div>
    <div id="area-bottom-left" :class="[$attrs.class, { editable }]"
         class="border"
         @mouseover="setDraggable"
         @click="editable=own"
         :style="{
          left: data.position[0] + 'px',
          top: data.position[3] - 15 + 'px',
          width: '15px',
          height: '15px',
       }"></div>
    <div id="area-bottom-right" :class="[$attrs.class, { editable }]"
         class="border"
         @mouseover="setDraggable"
         @click="editable=own"
         :style="{
          left: data.position[2] - 15 + 'px',
          top: data.position[3] - 15 + 'px',
          width: '15px',
          height: '15px',
       }"></div>
    </OnClickOutside>
</template>

<script setup lang="ts">
import {Area} from "@retro/shared";
import {type Position, useDraggable} from "@vueuse/core";
import {ref} from "vue";
import {OnClickOutside} from "@vueuse/components";
import {useBoardStore} from "../stores/board.ts";
import {useUserStore} from "../stores/users.ts";
import { faTrash , faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { faEye as farEye, faEyeSlash as farEyeSlash } from "@fortawesome/free-regular-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";


const props = defineProps<{ data: Area, board: HTMLElement|null }>()
const {updateComponent, deleteComponent} = useBoardStore();

const userStore = useUserStore()
const own = ref(userStore.me?.uuid === props.data.owner)

const editable = ref(false)

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
const COLORS = ['yellow', 'red', 'green', 'orange']
const switchColor = () => {
  props.data.color = COLORS[(COLORS.indexOf(props.data.color)+ 1) % 4]
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

const setDraggable = (evt : MouseEvent & { target : HTMLElement}) => {
  if(editable.value &&  evt.target) {
    const border = evt.target.id
    useDraggable(evt.target, {
      onEnd: (_pos: Position, _evt: PointerEvent) => {
        updateComponent(props.data)
      },
      onMove :(event) => {
        switch (border) {
          case 'area-top': props.data.position[1] = event.y; break;
          case 'area-left': props.data.position[0] = event.x; break;
          case 'area-right': props.data.position[2] = event.x; break;
          case 'area-bottom': props.data.position[3] = event.y; break;
          case 'area-top-left':  props.data.position[1] = event.y; props.data.position[0] = event.x; break;
          case 'area-top-right':  props.data.position[1] = event.y; props.data.position[2] = event.x; break;
          case 'area-bottom-left':  props.data.position[3] = event.y; props.data.position[0] = event.x; break;
          case 'area-bottom-right':  props.data.position[3] = event.y; props.data.position[2] = event.x; break;
          case 'header-area':
            const width = props.data.position[2] - props.data.position[0]
            const height = props.data.position[3] - props.data.position[1]
            props.data.position = [ event.x, event.y, event.x + width, event.y + height ];
            break;
        }
      },
      preventDefault: true,
      capture: true,
      exact: true,
      stopPropagation: true,
      disabled: () => !editable.value,
      containerElement : props.board
    })
  }
}

</script>

<style scoped>

#area-top {
  border-top: 2px solid var(--border-color);
  &.editable {
    border-top: 2px dashed var(--border-color);
    cursor: n-resize;
  }
}
#header-area {
  display:flex;
  flex-direction: row;
  gap: 5px;
  padding: 10px;
  line-height: 15px;
  text-align: center;
  vertical-align: center;
  width: 100%;
  &.editable {
    cursor: grab;
  }
  .title {
    cursor: text;
  }
}
#area-left {
  border-left: 2px solid var(--border-color);
  &.editable {
    border-left: 2px dashed var(--border-color);
    cursor: e-resize;
  }
}
#area-right {
  border-right: 2px solid var(--border-color);
  &.editable {
    border-right: 2px dashed var(--border-color);
    cursor: e-resize;
  }
}
#area-bottom {
  border-bottom: 2px solid var(--border-color);
  &.editable {
    border-bottom: 2px dashed var(--border-color);
    cursor: n-resize;
  }
}
#area-top-left {
  &.editable {
    cursor: nw-resize;
  }
}
#area-top-right {
  &.editable {
    cursor: ne-resize;
  }
}
#area-bottom-left {
  &.editable {
    cursor: sw-resize;
  }
}
#area-bottom-right {
  &.editable {
    cursor: se-resize;
  }
}
.border {
  position: absolute;
}
.color-selected {
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

.user-unfocused {
  filter: blur(2px) grayscale(50%)
}
</style>