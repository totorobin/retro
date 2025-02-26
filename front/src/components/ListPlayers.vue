<template>
  <div>
    <div v-for="p in players" :key="p.uuid" class="row" :title="p.name">
      <div>{{ p.name + (p.uuid === me?.uuid ? ' (vous)' : '') }}</div>
      <div>{{ (p.loggedIn ? '🔗' : '⛓️‍💥') }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {useUserStore} from "../stores/users.ts";
import {computed} from "vue";

const userStore = useUserStore()
const players = computed(() => userStore.users)
const me = computed(() => userStore.me)

</script>

<style lang="css" scoped>
.row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 10px;
}
</style>