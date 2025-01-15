<script setup lang="ts">
import type { ICard } from "@/models/ICard.ts";
defineProps<{ card: ICard }>()
</script>

<template>
  <div class="card-container">
    <v-card class="card-component flex min-w-[300px]">
      <v-card-text class="font-bold min-w-[300px]">
        <div class="text-h6">{{ card.description }}</div>
      </v-card-text>
      <div class="flex justify-end">
        <v-btn class="text-none" color="primary" icon="mdi-pencil" variant="text" slim></v-btn>
        <v-btn class="text-none" color="primary" icon="mdi-delete" variant="text" slim></v-btn>
      </div>
      <v-divider class="border-opacity-100" thickness="2"></v-divider>
      <v-card-text class="text-medium-emphasis">
        <div class="text-h8">Criação: {{ card.createdAt }}</div>
        <div class="text-h8">Ultima Modificação: {{ card.updatedAt }}</div>
      </v-card-text>
    </v-card>
  </div>
</template>

<style scoped>
.card-container {
  width: 20rem;
  margin: 5px;
}

.card-component {
  border-width: 2px;
}
</style>
