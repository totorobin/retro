<template>
  <div v-if="room">
    {{ room }}
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoomStore } from "../stores/room.ts";

const roomStore = useRoomStore();

const room = computed(() => roomStore.room);
</script>
