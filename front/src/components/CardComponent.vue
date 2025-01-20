<script setup lang="ts">
import type { CardModel } from '@/models/card.model.ts'
import { ref } from 'vue'
import type { ListModel } from '@/models/list.model.ts'
import requestService from '@/services/request.service.ts'
import alertService from '@/services/alert.service.ts'

const props = defineProps<{
  card: CardModel
  lista: ListModel
  boardId: string
  color: string
  disabled: boolean
}>()

const editing = ref(false)

async function editCard() {
  if (!props.card.content.trim()) {
    alertService.showError('Conteúdo para o cartão é obrigatório')
    return
  }

  const res = await requestService.put<CardModel>(
    `/cards/edit?board-id=${props.boardId}&list-id=${props.lista._id}`,
    props.card,
  )
  if (res.error || !res.result) {
    alertService.showError(res.error!.error)
    return
  }

  alertService.showSuccess('Card alterado com sucesso')
  editing.value = false
}

async function deleteCard() {
  const res = await requestService.delete<void>(
    `/cards/delete?board-id=${props.boardId}&list-id=${props.lista._id}&id=${props.card._id}`,
  )
  if (res.error) {
    alertService.showError(res.error!.error)
    return
  }

  const index = props.lista.cards!.findIndex((c) => c._id == props.card._id)
  props.lista.cards!.splice(index, 1)
  alertService.showSuccess('Lista deletada com suce')
}

async function cardUp() {
  const nextCard = props.lista.cards?.find((c) => c.priority == props.card.priority - 1)
  if (!nextCard) {
    alertService.showInfo('Não há card acima')
    return
  }

  props.card.priority--
  nextCard.priority++

  const [resDown, resUp] = await Promise.all([
    requestService.put<CardModel>(
      `/cards/edit?board-id=${props.boardId}&list-id=${props.lista._id}`,
      props.card,
    ),
    requestService.put<CardModel>(
      `/cards/edit?board-id=${props.boardId}&list-id=${props.lista._id}`,
      nextCard,
    ),
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

async function cardDown() {
  const previousCard = props.lista.cards?.find((c) => c.priority == props.card.priority + 1)
  if (!previousCard) {
    alertService.showInfo('Não há card abaixo')
    return
  }

  props.card.priority++
  previousCard.priority--

  const [resDown, resUp] = await Promise.all([
    requestService.put<CardModel>(
      `/cards/edit?board-id=${props.boardId}&list-id=${props.lista._id}`,
      props.card,
    ),
    requestService.put<CardModel>(
      `/cards/edit?board-id=${props.boardId}&list-id=${props.lista._id}`,
      previousCard,
    ),
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
  <div class="card-container">
    <v-card class="card-component flex min-w-[300px]" :color="color">
      <template v-slot:title>
        <v-card-title v-if="!editing">{{ card.content }}</v-card-title>
        <v-textarea :disabled="disabled" v-else v-model="card.content"></v-textarea>
      </template>
      <template v-slot:append>
        <v-btn :disabled="disabled" v-if="editing" icon="mdi-check" variant="text" slim @click="editCard()"></v-btn>
        <v-btn :disabled="disabled" icon="mdi-pencil" variant="text" slim @click="editing = !editing"></v-btn>
        <v-btn :disabled="disabled" icon="mdi-delete" variant="text" slim @click="deleteCard()"></v-btn>
      </template>
      <v-divider class="border-opacity-100" thickness="2"></v-divider>
      <v-card-text>
        <p class="text-sm">Criação: {{ new Date(card.createdAt).toLocaleString() }}</p>
        <p class="text-sm">Ultima Modificação: {{ new Date(card.updatedAt).toLocaleString() }}</p>
      </v-card-text>
      <template v-slot:actions>
        <v-btn icon="mdi-arrow-up" :disabled="disabled" variant="text" slim @click="cardUp()"></v-btn>
        <v-spacer></v-spacer>
        <v-btn icon="mdi-arrow-down" :disabled="disabled" variant="text" slim @click="cardDown()"></v-btn>
      </template>
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
