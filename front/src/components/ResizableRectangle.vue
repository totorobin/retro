<script lang="ts" setup>

import {OnClickOutside} from "@vueuse/components";
import {type Position, useDraggable} from "@vueuse/core";
import {useAttrs} from "vue";

const top = defineModel<number>('top', {default: 0});
const left = defineModel<number>('left', {default: 0})
const width = defineModel<number>('width', {default: 0})
const height = defineModel<number>('height', {default: 0})
const edition = defineModel<boolean>('edition')
const props = defineProps<{ editable: boolean, containterElement: HTMLElement | null }>()
const emits = defineEmits<{
  end: [top: number, left: number, width: number, height: number]
}>()

const attrs = useAttrs() as { style: Object, class: string[] }

const LIGN_WEIGHT = 20

const setDraggable = (evt: MouseEvent, border: string) => {
  const target = evt.target as HTMLElement
  if (edition.value && evt.target) {
    useDraggable(target, {
      onEnd: (_pos: Position, _evt: PointerEvent) => {
        emits('end', top.value, (left.value), (width.value), (height.value))
      },
      onMove: (event) => {
        const _top = Number(top.value);
        const _left = Number(left.value);
        switch (border) {
          case 'area-top':
            top.value = event.y + LIGN_WEIGHT / 2;
            height.value = Math.max(20, -(event.y + LIGN_WEIGHT / 2) + _top + height.value);
            break;
          case 'area-left':
            left.value = event.x + LIGN_WEIGHT / 2;
            width.value = Math.max(20, -(event.x + LIGN_WEIGHT / 2) + _left + (width.value));
            break;
          case 'area-right':
            width.value = Math.max(20, event.x - left.value + LIGN_WEIGHT / 2);
            break;
          case 'area-bottom':
            height.value = Math.max(20, event.y - top.value + LIGN_WEIGHT / 2);
            break;
          case 'area-top-left':
            top.value = event.y + LIGN_WEIGHT / 2;
            left.value = event.x + LIGN_WEIGHT / 2;
            height.value = Math.max(20, -(event.y + LIGN_WEIGHT / 2) + _top + height.value);
            width.value = Math.max(20, -(event.x + LIGN_WEIGHT / 2) + _left + width.value);
            break;
          case 'area-top-right':
            top.value = event.y + LIGN_WEIGHT / 2;
            width.value = Math.max(20, event.x - left.value + LIGN_WEIGHT / 2);
            height.value = Math.max(20, -(event.y + LIGN_WEIGHT / 2) + _top + height.value);
            break;
          case 'area-bottom-left':
            height.value = Math.max(20, event.y - top.value + LIGN_WEIGHT / 2);
            left.value = event.x + LIGN_WEIGHT / 2;
            width.value = Math.max(20, -(event.x + LIGN_WEIGHT / 2) + _left + width.value);
            break;
          case 'area-bottom-right':
            height.value = Math.max(20, event.y - top.value + LIGN_WEIGHT / 2);
            width.value = Math.max(20, event.x - left.value + LIGN_WEIGHT / 2);
            break;
          case 'movable-area':
            top.value = event.y - LIGN_WEIGHT / 2;
            left.value = event.x - LIGN_WEIGHT / 2;
            break;
        }
      },
      preventDefault: true,
      capture: true,
      exact: true,
      stopPropagation: true,
      disabled: () => !edition.value,
      containerElement: props.containterElement
    })
  }
}
</script>

<template>
  <div
      :class="[attrs.class, {visibleBorder : edition}]"
      :style="{
  position: 'absolute',
  left: left + 'px',
  top: top + 'px',
  width: width + 'px',
  height: height + 'px',
  ...attrs.style}"
      @click="editable ? edition = true : false">
    <slot></slot>
  </div>
  <OnClickOutside v-if="edition" @trigger="edition = false">
    <div :style="{
            left: (left  + LIGN_WEIGHT/ 2 )+ 'px',
            top: (top  + LIGN_WEIGHT/ 2 )+ 'px',
            width: (width - LIGN_WEIGHT)+ 'px',
            height: (height - LIGN_WEIGHT) + 'px',
        }"
         class="movable-area"
         @mouseover="(evt) => setDraggable(evt, 'movable-area')">
      <div class="options">
        <slot name="options"></slot>
      </div>
    </div>
    <div
        :style="{
            left: (left + LIGN_WEIGHT/ 2 )+ 'px',
            top: (top - LIGN_WEIGHT/ 2 )+ 'px',
            width: (width - LIGN_WEIGHT) + 'px',
            height: LIGN_WEIGHT + 'px',
        }"
        class="border area-top"
        @mouseover="(evt) => setDraggable(evt, 'area-top')"
    ></div>
    <div
        :style="{
            left: (left - LIGN_WEIGHT/ 2 )+ 'px',
            top: (top + LIGN_WEIGHT/ 2 )+ 'px',
            width: LIGN_WEIGHT + 'px',
            height: (height - LIGN_WEIGHT) + 'px',
        }"
        class="border area-left"
        @mouseover="(evt) => setDraggable(evt, 'area-left')"></div>
    <div
        :style="{
            left: (left + width - LIGN_WEIGHT/ 2 )+ 'px',
            top: (top + LIGN_WEIGHT/ 2 )+ 'px',
            width: LIGN_WEIGHT + 'px',
            height: (height - LIGN_WEIGHT) + 'px',
        }"
        class="border area-right"
        @mouseover="(evt) => setDraggable(evt, 'area-right')"></div>
    <div
        :style="{
            left: (left + LIGN_WEIGHT/ 2 )+ 'px',
            top: (top + height - LIGN_WEIGHT/ 2 )+ 'px',
            width: (width - LIGN_WEIGHT) + 'px',
            height: LIGN_WEIGHT + 'px',
        }"
        class="border area-bottom"
        @mouseover="(evt) => setDraggable(evt, 'area-bottom')"></div>
    <div
        :style="{
            left: (left - LIGN_WEIGHT/ 2 )+ 'px',
            top: (top - LIGN_WEIGHT/ 2 )+ 'px',
            width: LIGN_WEIGHT + 'px',
            height: LIGN_WEIGHT + 'px',
        }"
        class="border area-top-left"
        @mouseover="(evt) => setDraggable(evt, 'area-top-left')">
      <div class="dot"></div>
    </div>
    <div
        :style="{
            left: (left + width - LIGN_WEIGHT/ 2 )+ 'px',
            top: (top - LIGN_WEIGHT/ 2 )+ 'px',
          width: LIGN_WEIGHT + 'px',
          height: LIGN_WEIGHT + 'px',
      }"
        class="border area-top-right"
        @mouseover="(evt) => setDraggable(evt, 'area-top-right')">
      <div class="dot"></div>
    </div>
    <div
        :style="{
            left: (left - LIGN_WEIGHT/ 2 )+ 'px',
            top: (top + height - LIGN_WEIGHT/ 2 )+ 'px',
          width: LIGN_WEIGHT + 'px',
          height: LIGN_WEIGHT + 'px',
      }"
        class="border area-bottom-left"
        @mouseover="(evt) => setDraggable(evt, 'area-bottom-left')">
      <div class="dot"></div>
    </div>
    <div
        :style="{
            left: (left + width - LIGN_WEIGHT/ 2 )+ 'px',
            top: (top + height - LIGN_WEIGHT/ 2 )+ 'px',
          width: LIGN_WEIGHT + 'px',
          height: LIGN_WEIGHT + 'px',
      }"
        class="border area-bottom-right"
        @mouseover="(evt) => setDraggable(evt, 'area-bottom-right')">
      <div class="dot"></div>
    </div>
  </OnClickOutside>
</template>

<style scoped>
.visibleBorder {
  border: 1px dashed var(--border-color) !important;
}

.movable-area {
  position: absolute;
  cursor: grab;
}

.area-top {
  cursor: n-resize;
}

.area-left {
  cursor: e-resize;

}

.area-right {
  cursor: e-resize;
}

.area-bottom {
  cursor: n-resize;
}

.area-top-left {
  cursor: nw-resize;
}

.area-top-right {
  cursor: ne-resize;
}

.area-bottom-left {
  cursor: sw-resize;
}

.area-bottom-right {
  cursor: se-resize;
}

.border {
  position: absolute;
  background-color: grey;
  opacity: 20%;
}

.dot {
  background-color: white;
  opacity: 90%;
  border: solid 1px black;
  border-radius: 10px;
  padding: 5px;
  margin: 5px;
}

.options {
  position: absolute;
  top: -50px;
  right: 0px;
  gap: 5px;
  padding: 10px 10px;
  line-height: 15px;
  text-align: center;
  vertical-align: center;
  display: flex;
  flex-direction: row;
}
</style>