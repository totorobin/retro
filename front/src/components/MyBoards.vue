<script setup lang="ts">
import { type Board} from "@retro/shared";
import {useRouter} from 'vue-router'

const model = defineModel<Board[]>()

const router = useRouter()

const goToBoard = (boardId: string) => { router.push(`/r/${boardId}`) }
</script>

<template>
<div v-for="board in model" @click="goToBoard(board.uuid)">
  {{ board.uuid }}
</div>
</template>

<style scoped>

</style>