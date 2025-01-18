import { ref } from 'vue'
import { defineStore } from 'pinia'
import requestService from '@/services/requestService'

export const useAuth = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token'))

  function setToken(tokenValue: string) {
    localStorage.setItem('token', tokenValue)
    token.value = tokenValue
  }

  function getToken() {
    return token.value
  }

  async function checkToken() {
    const res = await requestService.get<{ email: string }>('user/auth/');
    if (res.error) {
      return
    }
    return res.result?.email
  }

  function logOut() {
    localStorage.removeItem('token')
    token.value = null;
  }

  return {
    token,
    getToken,
    setToken,
    checkToken,
    logOut,
  }
})
