<template>
  <div v-if="reconnecting" class="reconnection-alert">tentative de reconnection</div>
</template>

<script setup lang="ts">

import {useConnectionStore} from "../stores/connection.ts";
import {computed} from "vue";


const connectionStore = useConnectionStore()
const reconnecting = computed(() => !connectionStore.state.connected && !connectionStore.state.firstConnection)

</script>

<style scoped>
.reconnection-alert {
  position: absolute;
  top: 0;
  text-align: center;
  width: 100%;
}

</style>