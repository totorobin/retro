<template>
  <div class="overlay" @click="closeContextMenu" @contextmenu.prevent="closeContextMenu"/>
  <div
      :style="{ top: y + 'px', left: x + 'px' }"
      class="fixed h-1/3 z-50 context-menu"
  >
    <template
        v-for="action in actions"
        :key="action.action"
    >
      <div v-if="Array.isArray(action.action)" :style="action.style">{{ action.label }}<p v-for="a in action.action"
                                                                                          :style="a.style"
                                                                                          @click="emitAction(a.action)">{{
          a.label
        }}</p>
      </div>
      <div v-else @click="emitAction(action.action)">{{ action.label }}</div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import {defineEmits, defineProps} from 'vue';

const {actions, x, y} = defineProps<{
  actions: Array<{
    label: string,
    style: string,
    action: string | Array<{ label: string, style: string, action: string }>
  }>,
  x: number,
  y: number
}>();
const emit = defineEmits<{
  'action-clicked': [action: string]
}>();

const closeContextMenu = () => {
  emit('action-clicked', 'close-context-menu');
}

const emitAction = (action: string) => {
  emit('action-clicked', action);
};
</script>

<style scoped>
.context-menu {
  font-size: smaller;
  position: fixed;
  border: 1px solid var(--border-color);
  background: var(--background-color);
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  min-width: 20px;
  z-index: 10;
  display: inline-grid;
}

.context-menu div {
  padding: 5px;
  cursor: default;
  display: inline-flex;
}

.context-menu div p {
  margin: 2px;
  display: inline-flex;
  border: 1px solid transparent;
}

.context-menu div p:hover {
  margin: 2px;
  border: 1px solid var(--border-color);
}

.context-menu div:hover {
  background-color: var(--background-color-dark);
}

.context-menu .action:hover {
  cursor: pointer;
}


</style>