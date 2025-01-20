<script setup lang="ts">
import type { BoardAccessModel } from '@/models/board-access.model.ts'

interface Props {
  board: BoardAccessModel
  onView: (board: BoardAccessModel) => void
  onFavorite: (board: BoardAccessModel) => void
  onDelete: (board: BoardAccessModel) => void
}

defineProps<Props>()
</script>

<template>
  <v-card v-if="board && board.board" :color="board.board.backgroundColor">
    <v-card-title>{{ board.board.title }}</v-card-title>
    <v-card-text>
      <v-chip color="white">{{ `${board.board.lists.length} Listas` }}</v-chip>
    </v-card-text>
    <v-card-actions>
      <v-btn @click="onView(board)">Visualizar</v-btn>
      <v-spacer></v-spacer>
      <v-btn
        @click="onFavorite(board)"
        :color="board.favorite ? 'yellow' : 'white'"
        icon="mdi-star"
        variant="text"
        slim
      ></v-btn>
      <v-btn
        @click="onDelete(board)"
        color="white"
        icon="mdi-delete"
        variant="text"
        slim
      ></v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped></style>
