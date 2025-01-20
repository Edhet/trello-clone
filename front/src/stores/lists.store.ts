import { defineStore } from 'pinia'
import { ref } from 'vue'
import requestService from '@/services/request.service.ts'
import alertService from '@/services/alert.service.ts'
import type { ListModel } from '@/models/list.model'

export const listsStore = defineStore('boardsStore', () => {
  const listsRef = ref<ListModel[]>([])

  async function fetch() {
    const listsResponse = await requestService.get<{ lists: ListModel[] }>('lists/all')
    if (listsResponse.error || !listsResponse.result) {
      alertService.showError(listsResponse.error!.error)
      return
    }
    set(listsResponse.result.lists)
  }

  async function fetchOne(boardId: string) {
    const response = await requestService.get<ListModel>(`lists/${boardId}`)
    if (response.error || !response.result) {
      alertService.showError(response.error!.error)
      return
    }
    listsRef.value.push(response.result)
  }

  function set(lists: ListModel[]) {
    listsRef.value = lists
  }

  function get() {
    return listsRef.value
  }

  return {
    listsRef,
    fetchOne,
    fetch,
    set,
    get,
  }
})
