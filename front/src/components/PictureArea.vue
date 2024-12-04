<script setup lang="ts">
import {Picture} from "@retro/shared";
import {computed, ref} from "vue";
import ResizableRectangle from "./ResizableRectangle.vue";
import {useUserStore} from "../stores/users.ts";
import {useBoardStore} from "../stores/board.ts";
import {faBackwardFast, faBackwardStep, faForwardFast, faForwardStep, faTrash} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {useLayerOrder} from "../stores/LayerOrder.ts";

const props = defineProps<{ data: Picture , board: HTMLElement|null}>();

const {updateComponent, deleteComponent} = useBoardStore();

const userStore = useUserStore()
const own = ref(userStore.me?.uuid === props.data.owner)

const width = computed( () => props.data.position[2] - props.data.position[0])
const height = computed(() => props.data.position[3] - props.data.position[1])

const updatePositions = (top, left, width, height) => {
  props.data.position = [left, top, left+width, top+height]
  updateComponent(props.data)
}
const removePicture = () => {
  if(own.value && props.data.id){
    deleteComponent(props.data.id)
  }
}

const { backwardAll, backward, forward, forwardAll } = useLayerOrder()
</script>

<template>

  <ResizableRectangle :containter-element="board" :top="data.position[1]" :left="data.position[0]" :width="width" :height="height" :editable="own" @end="updatePositions" >
  <img :src="`/data/pictures/${data.imageId}`" />
    <template #options>
      <span>Prio: {{ data.priority }}</span>
      <font-awesome-icon :icon="faBackwardFast" style="cursor: pointer"  @click.stop="backwardAll(data.id)"/>
      <font-awesome-icon :icon="faBackwardStep" style="cursor: pointer"  @click.stop="backward(data.id)"/>
      <font-awesome-icon :icon="faForwardStep" style="cursor: pointer"  @click.stop="forward(data.id)"/>
      <font-awesome-icon :icon="faForwardFast" style="cursor: pointer"  @click.stop="forwardAll(data.id)"/>
      <font-awesome-icon :icon="faTrash" style="cursor: pointer"  @click.stop="removePicture"/>
    </template>
  </ResizableRectangle>
</template>

<style scoped>
img {
  width: 100%;
  height: 100%;
}
</style>