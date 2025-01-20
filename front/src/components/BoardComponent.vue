<script setup lang="ts">
import type { BoardAccessModel } from '@/models/board-access.model.ts'
import type { ListModel } from '@/models/list.model.ts'
import ListComponent from '@/components/ListComponent.vue'

defineProps<{ board: BoardAccessModel }>()

// Mock de uma lista
const tarefasDeTrabalho: ListModel[] = [
  {
    title: 'Lista de Tarefas de Trabalho',
    cards: [
      {
        id: 1,
        description: 'Completar o relatório do projeto',
        createdAt: '2025-01-01T10:00:00Z',
        updatedAt: '2025-01-02T15:30:00Z',
      },
      {
        id: 2,
        description: 'Preparar os slides para a reunião',
        createdAt: '2025-01-03T08:00:00Z',
        updatedAt: '2025-01-03T12:45:00Z',
      },
      {
        id: 3,
        description: 'Atualizar a equipe sobre o progresso',
        createdAt: '2025-01-04T09:00:00Z',
        updatedAt: '2025-01-04T11:30:00Z',
      },
    ],
  },
  {
    title: 'Lista de Compras do Mês',
    cards: [
      {
        id: 1,
        description: 'Comprar leite e ovos',
        createdAt: '2025-01-10T14:20:00Z',
        updatedAt: '2025-01-10T16:00:00Z',
      },
      {
        id: 2,
        description: 'Comprar frutas e vegetais',
        createdAt: '2025-01-11T09:30:00Z',
        updatedAt: '2025-01-11T10:00:00Z',
      },
      {
        id: 3,
        description: 'Comprar produtos de limpeza',
        createdAt: '2025-01-12T10:00:00Z',
        updatedAt: '2025-01-12T11:15:00Z',
      },
    ],
  },
]

// fetch da lista
// Aqui estamos simulando a resposta do servidor
const listaResponse = tarefasDeTrabalho
</script>

<template>
  <div class="board-region">
    <div class="flex items-center">
      <h2 class="board-title mr-4">{{ board.name }}</h2>
      <v-btn style="border-width: 2px" icon="$plus" size="small"></v-btn>
    </div>
    <div class="flex gap-2 overflow-x-scroll pb-4">
      <template v-for="(lista, index) in listaResponse" :key="index">
        <ListComponent :lista="lista" />
      </template>
    </div>
  </div>
</template>
