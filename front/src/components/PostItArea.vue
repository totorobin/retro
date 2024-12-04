<script lang="ts" setup>

import ResizableRectangle from "./ResizableRectangle.vue";
import {Area} from "@retro/shared";
import {useBoardStore} from "../stores/board.ts";
import {useUserStore} from "../stores/users.ts";
import {computed, ref} from "vue";
import {
  faBackwardFast,
  faBackwardStep,
  faEye,
  faEyeSlash,
  faForwardFast,
  faForwardStep,
  faTrash
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {faEye as farEye, faEyeSlash as farEyeSlash} from "@fortawesome/free-regular-svg-icons";

import {useLayerOrder} from "../stores/LayerOrder.ts";


const props = defineProps<{ data: Area, board: HTMLElement | null }>()
const {updateComponent, deleteComponent} = useBoardStore();

const userStore = useUserStore()
const own = ref(userStore.me?.uuid === props.data.owner)

const width = computed(() => props.data.position[2] - props.data.position[0])
const heigth = computed(() => props.data.position[3] - props.data.position[1])
const updatePositions = (top: number, left: number, width: number, height: number) => {
  props.data.position = [left, top, left + width, top + height]
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
  if (own.value && props.data.id) {
    deleteComponent(props.data.id)
  }
}
const COLORS = ['yellow', 'red', 'green', 'orange', 'blue']
const switchColor = () => {
  props.data.color = COLORS[(COLORS.indexOf(props.data.color) + 1) % COLORS.length]
  updateComponent(props.data)
}
const toggleForceVisibility = () => {
  //switch between 'null', 'false' or 'true'
  props.data.forceVisiblility = props.data.forceVisiblility == null ? false : (props.data.forceVisiblility ? null : true)
  updateComponent(props.data)
}
const showHideArea = () => {
  props.data.visible = !props.data.visible
  updateComponent(props.data)
}

//Move frontward, backward
const {backwardAll, backward, forward, forwardAll} = useLayerOrder()
</script>

<template>
  <ResizableRectangle :containter-element="board" :editable="own" :height="heigth"
                      :left="data.position[0]" :top="data.position[1]" :width="width" style="border: 1px solid var(--border-color);" @end="updatePositions">
    <div id="header-area" :class="[$attrs.class]">
      <div :class="[data.color]" class="color-selected" title="choose color" @click.self.stop="switchColor"></div>
      <font-awesome-icon v-if="own" :icon="data.forceVisiblility ? faEye : faEyeSlash"
                         :style="{ opacity : data.forceVisiblility == null ? '0.5' : '1'}"
                         title="toggle Post-it visibility" @click.self.stop="toggleForceVisibility"/>
      <div :contenteditable="own" class="title" style="min-width: 30px; min-height: 15px; padding-left: 5px;"
           @blur="onTextTitle"
           @click.stop>{{ data.title || '' }}
      </div>
    </div>
    <template #options>
      <font-awesome-icon :icon="faBackwardFast" style="cursor: pointer" @click.stop="backwardAll(data.id)"/>
      <font-awesome-icon :icon="faBackwardStep" style="cursor: pointer" @click.stop="backward(data.id)"/>
      <font-awesome-icon :icon="faForwardStep" style="cursor: pointer" @click.stop="forward(data.id)"/>
      <font-awesome-icon :icon="faForwardFast" style="cursor: pointer" @click.stop="forwardAll(data.id)"/>
      <font-awesome-icon :icon="data.visible ? farEye : farEyeSlash" style="cursor: pointer" title="toggle Area visibility"
                         @click.stop="showHideArea"/>
      <font-awesome-icon :icon="faTrash" style="cursor: pointer" @click.stop="removeArea"/>
    </template>
  </ResizableRectangle>
</template>


<style scoped>

#header-area {
  display: flex;
  flex-direction: row;
  gap: 5px;
  padding: 10px 10px;
  line-height: 15px;
  text-align: center;
  vertical-align: center;
  width: calc(100% - 20px); /* 100% - 2x padding */

  .title {
    cursor: text;
  }
}

.color-selected {
  height: 15px;
  width: 15px;
  border-radius: 15px;
}

.green {
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

.blue {
  background-color: var(--blue-post-it);
}


.user-unfocused {
  filter: blur(2px) grayscale(50%)
}
</style>