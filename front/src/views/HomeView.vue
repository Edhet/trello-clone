<script setup lang="ts">
import NavBarComponent from "@/components/NavBarComponent.vue";
import type {IBoard} from "@/models/IBoard.ts";
import BoardComponent from "@/components/BoardComponent.vue";
import type {IList} from "@/models/IList.ts";

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

//mock de um quadro só
const board: IBoard =  {
        name: 'Quadro de Desenvolvimento Web',
        id: 194382561,
        description: 'Quadro para organizar tarefas relacionadas ao desenvolvimento de sites e aplicativos web.'
    };

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
  <h1>Teste</h1>
</template>
