<script setup lang="ts">
import type {IList} from "@/models/IList.ts";
defineProps<{lista: IList}>()
</script>

<template>
  <div class="list-container">
    <v-card :title="lista.title" class="list-component min-w-[300px]">
      <template v-slot:append>
          <v-btn class="text-none" color="primary" icon="mdi-pencil" variant="text" slim></v-btn>
      </template>
      <v-divider class="border-opacity-100" thickness="2" ></v-divider>
      <v-card-actions class="flex flex-col min-w-[300px]">
        <template v-for="(card, index) in lista.cards" :key="index">
          <CardComponent :card="card" />
        </template>
      </v-card-actions>
    </v-card>
  </div>
</template>

<style scoped>
  .list-container{
    width: 25rem;
    margin: 5px;
  }
  .list-component{
    border-width: 2px;
  }
</style>

