<script setup lang="ts">
import type {IBoard} from "@/models/IBoard.ts";

defineProps<{boards: IBoard[]}>()
</script>

<template>
  <div class="board-region ">
    <div class="flex items-center">
      <h2 class="board-title mr-4">Meus Quadros</h2>
      <v-btn style="border-width: 2px;" icon="$plus" size="small"></v-btn>
    </div>
    <div class="flex gap-2 overflow-x-scroll pb-4">
      <template v-for="board in boards">
        <div class="board-container min-w-[300px]">
          <v-card :title="board.name" color="" class="board-component">
            <template v-slot:append>
              <v-btn class="text-none" color="primary" icon="mdi-pencil" variant="text" slim></v-btn>
              <v-btn class="text-none" color="primary" icon="mdi-delete" variant="text" slim></v-btn>
              <v-btn class="text-none" color="yellow" icon="mdi-star" variant="text" slim></v-btn>
            </template>
            <v-divider class="border-opacity-100" thickness="2" ></v-divider>
            <v-card-text class="text-medium-emphasis pa-6">
              <div>{{board.description}}</div>
            </v-card-text>
          </v-card>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
  .board-container{
    width: 20rem;
    margin: 5px;
  }
  .board-component {
    border-width: 2px;
  }
</style>
