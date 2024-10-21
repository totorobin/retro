<template>
  <div
      :style="{ top: y + 'px', left: x + 'px' }"
      class="fixed h-1/3 z-50 context-menu"
  >
    <div
        v-for="action in actions"
        :key="action.action"
        @click="emitAction(action.action)"
    >
      {{ action.label }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import {defineEmits, defineProps} from 'vue';

const {actions, x, y} = defineProps<{ actions: Array<{ label: string, action: string }>, x: number, y: number }>();
const emit = defineEmits<{
  'action-clicked': [action: string]
}>();

const emitAction = (action: string) => {
  emit('action-clicked', action);
};
</script>

<style scoped>
.context-menu {
  position: absolute;
  background: var(--background-color);
  border: 1px solid #ccc;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  min-width: 10px;
}

.context-menu div {
  padding: 10px;
  cursor: pointer;
}

.context-menu div:hover {
  font-weight: bolder;
}
</style>