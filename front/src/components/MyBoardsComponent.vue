<script setup lang="ts">
import type { BoardAccessModel } from '@/models/board-access.model.ts'
import requestService from '@/services/request.service.ts'
import alertService from '@/services/alert.service.ts'
import { boardsStore } from '@/stores/boards.store.ts'
import router from '@/router'

const boards = boardsStore()

async function deleteBoard(board: BoardAccessModel) {
  const res = await requestService.delete<void>(`/boards/delete?id=${board.board._id}`)
  if (res.error) {
    alertService.showError(res.error.error)
    return
  }

  boards.set(boards.get().filter((b) => b.board._id != board.board._id))
  alertService.showSuccess('Quadro excluído com sucesso')
}

async function favoriteBoard(board: BoardAccessModel) {
  const res = await requestService.patch<void>(`/boards/favorite?id=${board.board._id}`)
  if (res.error) {
    alertService.showError(res.error!.error)
    return
  }

  alertService.showSuccess(board.favorite ? 'Quadro desfavoritado' : 'Quadro favoritado')
  board.favorite = !board.favorite
}

function newBoardScreen() {
  router.push('/quadro/novo')
}

function boardScreen(board: BoardAccessModel) {
  router.push(`/quadro/${board.board._id}`)
}
</script>

<template>
  <v-container class="p-8">
    <div class="flex items-center mb-12">
      <h2 class="board-title mr-4">Meus Quadros</h2>
      <v-btn @click="newBoardScreen()" class="" icon="$plus" size="small"></v-btn>
    </div>

    <div class="grid grid-cols-2 gap-4 pb-4">
      <template v-if="boards.get().length == 0">
        <p>Vocẽ não possui quadros</p>
      </template>
      <template v-for="board in boards.get()" :key="board._id">
        <v-card :color="board.board.backgroundColor">
          <v-card-title>{{ board.board.title }}</v-card-title>
          <v-card-text>
            <v-chip>{{ `${board.board.lists.length} Listas` }}</v-chip>
          </v-card-text>
          <v-card-actions>
            <v-btn @click="boardScreen(board)">Visualizar</v-btn>
            <v-spacer></v-spacer>
            <v-btn
              @click="favoriteBoard(board)"
              :color="board.favorite ? 'yellow' : ''"
              icon="mdi-star"
              variant="text"
              slim
            ></v-btn>
            <v-btn
              @click="deleteBoard(board)"
              icon="mdi-delete"
              variant="text"
              slim
            ></v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </div>
  </v-container>
</template>

<style scoped></style>
