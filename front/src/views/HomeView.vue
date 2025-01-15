<script setup lang="ts">
import type {IBoard} from "@/models/IBoard.ts";
import BoardComponent from "@/components/BoardComponent.vue";
import type {IList} from "@/models/IList.ts";
import CollectionComponent from "@/components/CollectionComponent.vue";
import MyBoardsComponent from "@/components/MyBoardsComponent.vue";
import ListComponent from "@/components/ListComponent.vue";
import CardComponent from "@/components/CardComponent.vue";

//-------------------------
//fetch das coleções do usuario

//mock de coleções
const collections = [
    {
        id: 1,
        name: 'Coleção preferida',
    },
    {
        id: 2,
        name: 'Coleção de quadro tal',
    }
]

//-------------------------
//fazer um fetch dos quadros do usuario

//mock de um quadro
const board =  {
      name: 'Quadro de Desenvolvimento Web',
      id: 194382561,
      description: 'Quadro para organizar tarefas relacionadas ao desenvolvimento de sites e aplicativos web.'
    };
//mock de quadros do usuario
const boards: IBoard[] = [
    {
        name: 'Quadro de Desenvolvimento Web',
        id: 194382561,
        description: 'Quadro para organizar tarefas relacionadas ao desenvolvimento de sites e aplicativos web.'
    },
    {
        name: 'Quadro de Design de Produto',
        id: 194382562,
        description: 'Este quadro é focado no planejamento e execução de designs para novos produtos.'
    },
    {
        name: 'Quadro de Marketing Digital',
        id: 194382563,
        description: 'Planejamento de campanhas e estratégias de marketing digital para aumentar a visibilidade da marca.'
    },
    {
        name: 'Quadro de Gestão de Projetos',
        id: 194382564,
        description: 'Quadro para organizar e acompanhar o progresso de diversos projetos em andamento.'
    },
    {
        name: 'Quadro de Recrutamento e Seleção',
        id: 194382565,
        description: 'Quadro voltado para a gestão de processos de recrutamento e seleção de novos colaboradores.'
    }
]

//-------------------------
//fetch de listas

//mock de listas
const tarefasDeTrabalho: IList = {
  title: "Lista de Tarefas de Trabalho",
  cards: [
    {
      id: 1,
      description: "Completar o relatório do projeto",
      createdAt: "2025-01-01T10:00:00Z",
      updatedAt: "2025-01-02T15:30:00Z",
    },
    {
      id: 2,
      description: "Preparar os slides para a reunião",
      createdAt: "2025-01-03T08:00:00Z",
      updatedAt: "2025-01-03T12:45:00Z",
    },
    {
      id: 3,
      description: "Atualizar a equipe sobre o progresso",
      createdAt: "2025-01-04T09:00:00Z",
      updatedAt: "2025-01-04T11:30:00Z",
    },
  ],
};

//-------------------------
//fetch de cards

//mock de card
const card = {
    id : 1,
    description: "card do joaozinho",
    createdAt: Date.now().toString(),
    updatedAt: Date.now().toString()
}


</script>

<template>

<!-- MINHAS COLEÇÕES-->
  <template>
    <div class="board-region ">
      <div class="flex items-center">
        <h2 class="board-title mr-4">Minhas Coleções</h2>
        <v-btn style="border-width: 2px;" icon="$plus" size="small"></v-btn>
      </div>
      <div class="flex gap-2 overflow-x-scroll pb-4">
        <template v-for="colection in collections">
        <CollectionComponent :collection="colection"/>
        </template>
      </div>
    </div>
  </template>

  <!--  MEUS QUADROS-->
  <MyBoardsComponent :boards="boards"/>

  <!--  UM QUADROS-->
  <BoardComponent :board="board"/>

  <!--  UMA LISTA-->
  <ListComponent :lista="tarefasDeTrabalho"/>
  <!--  UM CARD-->
  <CardComponent :card="card"/>

</template>
