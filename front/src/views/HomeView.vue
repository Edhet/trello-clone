<script setup lang="ts">
import { onMounted } from 'vue'
import NavBarComponent from '@/components/NavBarComponent.vue'
import { boardsStore } from '@/stores/boards.store.ts'
import { userInfoStore } from '@/stores/userInfo.store.ts'

const boards = boardsStore()
const userInfo = userInfoStore()

onMounted(async () => {
  boards.fetch()
  userInfo.fetch()
})
</script>

<template>
  <NavBarComponent :username="userInfo.userInfoRef?.username" />
  <MyBoardsComponent />
</template>
