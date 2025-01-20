<script setup lang="ts">
import type { BoardAccessModel } from '@/models/board-access.model.ts'
import requestService from '@/services/request.service.ts'
import alertService from '@/services/alert.service.ts'
import { boardsStore } from '@/stores/boards.store.ts'
import router from '@/router'
import BoardComponent from './BoardComponent.vue'

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
        <BoardComponent
          :board="board"
          @delete="deleteBoard"
          @favorite="favoriteBoard"
          @view="boardScreen"
        />
      </template>
    </div>
  </v-container>
</template>

<style scoped></style>
