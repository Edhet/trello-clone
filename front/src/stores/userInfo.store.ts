import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { UserInterface } from '@/models/user.model.ts'
import requestService from '@/services/request.service.ts'
import { useAuth } from '@/stores/auth.store.ts'
import alertService from '@/services/alert.service.ts'

export const userInfoStore = defineStore('userInfoStore', () => {
  const userInfoRef = ref<UserInterface>()

  async function fetch() {
    const userInfoResponse = await requestService.get<UserInterface>(
      `/user/info?email=${await useAuth().checkToken()}`,
    )

    if (userInfoResponse.error || !userInfoResponse.result) {
      alertService.showError(userInfoResponse.error!.error)
      return
    }

    set(userInfoResponse.result)
  }

  function get() {
    return userInfoRef.value
  }

  function set(userInfo: UserInterface) {
    userInfoRef.value = userInfo
  }

  return {
    userInfoRef,
    fetch,
    get,
    set,
  }
})
