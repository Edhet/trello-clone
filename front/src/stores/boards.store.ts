import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { BoardAccessModel } from '@/models/board-access.model.ts'
import requestService from '@/services/request.service.ts'
import alertService from '@/services/alert.service.ts'

export const boardsStore = defineStore('boardsStore', () => {
  const boardsRef = ref<BoardAccessModel[]>([])

  async function fetch() {
    const boardsResponse = await requestService.get<{ boards: BoardAccessModel[] }>('boards/all')
    if (boardsResponse.error || !boardsResponse.result) {
      alertService.showError(boardsResponse.error!.error)
      return
    }
    set(boardsResponse.result.boards)
  }

  async function fetchOne(boardId: string) {
    const response = await requestService.get<BoardAccessModel>(`boards/${boardId}`)
    if (response.error || !response.result) {
      alertService.showError(response.error!.error)
      return
    }
    boardsRef.value.push(response.result)
  }

  function set(boards: BoardAccessModel[]) {
    boardsRef.value = boards
  }

  function get() {
    return boardsRef.value
  }

  return {
    boardsRef,
    fetchOne,
    fetch,
    set,
    get,
  }
})
