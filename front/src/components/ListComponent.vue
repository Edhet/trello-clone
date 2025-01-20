<script setup lang="ts">
import type { ListModel } from '@/models/list.model.ts'

defineProps<{
  list: ListModel,
  bgColor: string, textColor: string,
  onDelete: (List: ListModel) => void
}>()

</script>

<template>
  <div class="list-container">
    <v-card :color="bgColor" :title="list.title" class="list-component min-w-[300px]">
      <template v-slot:append>
        <v-btn class="text-none" :color="textColor" icon="mdi-pencil" variant="text" slim></v-btn>
        <v-btn @click="onDelete(list)" color="white" icon="mdi-delete" variant="text" slim></v-btn>
      </template>
      <v-divider class="border-opacity-100" thickness="2"></v-divider>
      <v-card-actions class="flex flex-col min-w-[300px]">
        <template v-for="(card, index) in list.cards" :key="index">
          <CardComponent :card="card" />
        </template>
      </v-card-actions>
    </v-card>
  </div>
</template>

<style scoped>
.list-container {
  width: 25rem;
  margin: 5px;
}

.list-component {
  border-width: 2px;
}
</style>
