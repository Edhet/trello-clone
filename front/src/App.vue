<script setup lang="ts">
import AlertComponent from '@/components/AlertComponent.vue'
</script>

<template>
  <v-app>
    <v-main style="height: 100%">
      <RouterView />
    </v-main>
    <AlertComponent></AlertComponent>
  </v-app>
</template>
