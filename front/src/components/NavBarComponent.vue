<script setup lang="ts">
import { useAuth } from '@/stores/auth.store.ts'
import { useRouter } from 'vue-router'

defineProps<{ username?: string }>()

const auth = useAuth()
const router = useRouter()

function sair() {
  auth.logOut()
  router.push('/login')
}
</script>
<template>
  <div class="flex gap-3 items-center justify-between mx-auto max-w-[1024px] pt-4">
    <RouterLink to="/home"><h1>TaskFlow</h1></RouterLink>
    <div class="flex gap-3 items-center justify-between">
      <RouterLink class="underline" to="/profile"><p class="font-bold">{{ username ?? '-' }}</p></RouterLink>
      <v-btn @click="sair()" color="primary">Sair</v-btn>
    </div>
  </div>
  <v-divider class="border-opacity-100 mt-4" thickness="2"></v-divider>
</template>
