<script setup lang="ts">
import type { ICollection } from '@/models/ICollection.ts'

defineProps<{ collection: ICollection }>()
</script>

<template>
  <div class="collection-container min-w-[300px]">
    <v-card :title="collection.name" class="collection-component">
      <template v-slot:append>
        <v-btn class="text-none" color="primary" icon="mdi-pencil" variant="text" slim></v-btn>
        <v-btn class="text-none" color="primary" icon="mdi-delete" variant="text" slim></v-btn>
      </template>
    </v-card>
  </div>
</template>

<style scoped>
.collection-container {
  width: 25rem;
  margin: 5px;
}
.collection-component {
  border-width: 2px;
}
</style>
