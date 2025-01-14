import { ref } from 'vue'
import { defineStore } from 'pinia'
import requestService from '@/services/requestService'

export const useAuth = defineStore('auth', () => {

  const token = ref(localStorage.getItem('token'))

  function setToken(tokenValue: string) {
    localStorage.setItem('token', tokenValue)
    token.value = tokenValue
  }

  async function checkToken() {
    try {
      const tokenAuth = 'Bearer ' + token.value
      const { data } = await requestService.get('user/auth/', {
        headers: {
          Authorization: tokenAuth,
        },
      })
      return data
    } catch (error) {
      return
    }
  }

  return {
    token,
    setToken,
    checkToken
  }
})
