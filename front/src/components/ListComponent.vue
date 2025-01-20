<script setup lang="ts">
import type { ListModel } from '@/models/list.model.ts'
import { computed, ref } from 'vue'
import requestService from '@/services/request.service.ts'
import alertService from '@/services/alert.service.ts'
import type { BoardAccessModel } from '@/models/board-access.model.ts'
import type { CardModel } from '@/models/card.model.ts'

const props = defineProps<{
  lista: ListModel
  board: BoardAccessModel
  bgColor: string
  textColor: string
  disabled: boolean
}>()

const sortedList = computed(() => {
  return props.lista.cards?.sort((a, b) => a.priority - b.priority)
})

const editing = ref(false)
const newCardContent = ref('')

async function deleteList() {
  const res = await requestService.delete<void>(
    `/lists/delete?board-id=${props.board.board._id}&id=${props.lista._id}`,
  )
  if (res.error) {
    alertService.showError(res.error!.error)
    return
  }

  const index = props.board.board.lists.findIndex((l) => l._id == props.lista._id)
  props.board.board.lists.splice(index, 1)
  alertService.showSuccess('Lista deletada com suce')
}

async function criarCard() {
  if (!newCardContent.value.trim()) {
    alertService.showError('Conteúdo para o cartão é obrigatório')
    return
  }

  const res = await requestService.post<CardModel>(
    `/cards/new?board-id=${props.board.board._id}&list-id=${props.lista._id}`,
    {
      content: newCardContent.value,
    },
  )
  if (res.error || !res.result) {
    alertService.showError(res.error!.error)
    return
  }

  props.lista.cards!.push(res.result)
  newCardContent.value = ''
  alertService.showSuccess('Card criado com sucesso')
}

async function editList() {
  if (!props.lista.title.trim()) {
    alertService.showError('Nome para lista é obrigatório')
    return
  }

  const res = await requestService.put<ListModel>(
    `/lists/edit?board-id=${props.board.board._id}`,
    props.lista,
  )
  if (res.error || !res.result) {
    alertService.showError(res.error!.error)
    return
  }

  alertService.showSuccess('Lista alterada com sucesso')
  editing.value = false
}

async function listUp() {
  const nextList = props.board.board.lists.find((l) => l.order == props.lista.order - 1)
  if (!nextList) {
    alertService.showInfo('Não há lista à esquerda')
    return
  }

  props.lista.order--
  nextList.order++

  const [resDown, resUp] = await Promise.all([
    requestService.put<CardModel>(`/lists/edit?board-id=${props.board.board._id}`, props.lista),
    requestService.put<CardModel>(`/lists/edit?board-id=${props.board.board._id}`, nextList),
  ])
  if (resDown.error || !resDown.result) {
    alertService.showError(resDown.error!.error)
    return
  }
  if (resUp.error || !resUp.result) {
    alertService.showError(resUp.error!.error)
    return
  }
  alertService.showSuccess('Ordem alterada')
}

async function listDown() {
  const nextList = props.board.board.lists.find((l) => l.order == props.lista.order + 1)
  if (!nextList) {
    alertService.showInfo('Não há lista à direita')
    return
  }

  props.lista.order++
  nextList.order--

  const [resDown, resUp] = await Promise.all([
    requestService.put<CardModel>(`/lists/edit?board-id=${props.board.board._id}`, props.lista),
    requestService.put<CardModel>(`/lists/edit?board-id=${props.board.board._id}`, nextList),
  ])
  if (resDown.error || !resDown.result) {
    alertService.showError(resDown.error!.error)
    return
  }
  if (resUp.error || !resUp.result) {
    alertService.showError(resUp.error!.error)
    return
  }
  alertService.showSuccess('Ordem alterada')
}
</script>

<template>
  <div>
    <v-card :color="bgColor" class="min-w-96">
      <template v-slot:title>
        <v-card-title v-if="!editing">{{ lista.title }}</v-card-title>
        <v-text-field v-else v-model="props.lista.title"></v-text-field>
      </template>
      <template v-slot:append>
        <v-btn v-if="editing" :disabled="disabled" icon="mdi-check" variant="text" slim @click="editList()"></v-btn>
        <v-btn icon="mdi-pencil" :disabled="disabled" variant="text" slim @click="editing = !editing"></v-btn>
        <v-btn @click="deleteList()" :disabled="disabled" icon="mdi-delete" variant="text" slim></v-btn>
      </template>
      <v-divider class="border-opacity-100" thickness="2"></v-divider>
      <v-card-actions class="flex flex-col min-w-[300px]">
        <template v-for="(card, index) in sortedList" :key="index">
          <CardComponent
            :disabled="disabled"
            :card="card"
            :lista="lista"
            :board-id="board.board._id"
            :color="textColor"
          />
        </template>
        <v-card-actions class="w-full">
          <v-text-field label="Conteúdo do card" v-model="newCardContent" :disabled="disabled"></v-text-field>
          <v-btn @click="criarCard()" :disabled="disabled" icon="mdi-plus"></v-btn>
        </v-card-actions>
      </v-card-actions>
      <template v-slot:actions>
        <v-btn @click="listUp()" :disabled="disabled" icon="mdi-arrow-left" variant="text" slim></v-btn>
        <v-spacer></v-spacer>
        <v-btn @click="listDown()" :disabled="disabled" icon="mdi-arrow-right" variant="text" slim></v-btn>
      </template>
    </v-card>
  </div>
</template>
