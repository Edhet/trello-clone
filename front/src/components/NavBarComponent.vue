<script setup lang="ts">
import ButtonComponent from "@/components/ButtonComponent.vue";
function sair() {
  console.log("Sair")
}
defineProps<{ username: string }>()
</script>
<template>
  <div class="flex gap-3 flex items-center justify-between mx-auto max-w-[1024px] pt-4">
    <h1> TaskFlow</h1>
    <h2> Home </h2>
    <div>
      <p>{{ username }}</p>
      <ButtonComponent texto="Sair" :button-function=sair />
    </div>
  </div>
  <v-divider class="border-opacity-100 mt-4" thickness="2"></v-divider>
</template>
