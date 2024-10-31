<template>
  <div class="overlay-focus" >
    <div class="close-overlay-btn" @click="$emit('close')">{{ closingText }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  closingText: string;
}>()

defineEmits<{
  close: [void]
}>()
</script>

<style scoped>
.overlay-focus {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.2);
  backdrop-filter: blur(2px) grayscale(20%);
}
.close-overlay-btn {
  padding: 20px;
  cursor: pointer;
}
</style>