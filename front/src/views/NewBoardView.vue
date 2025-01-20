<script setup lang="ts">
import { ref } from 'vue'
import alertService from '@/services/alert.service.ts'
import requestService from '@/services/request.service.ts'
import { useRouter } from 'vue-router'
import { boardsStore } from '@/stores/boards.store.ts'
import type { BoardModel } from '@/models/board-access.model.ts'

const router = useRouter()
const boards = boardsStore()

const backgroundColor = ref(),
  textColor = ref(),
  title = ref()

async function criarNovo() {
  if (!backgroundColor.value.trim() || !textColor.value.trim() || !title.value.trim()) {
    alertService.showError('Todos os valores são obrigatórios')
    return
  }

  const res = await requestService.post<BoardModel>('boards/new', {
    title: title.value,
    backgroundColor: backgroundColor.value,
    textColor: textColor.value,
  })
  if (res.error || !res.result) {
    alertService.showError(res.error!.error)
    return
  }

  await boards.fetchOne(res.result._id)
  alertService.showSuccess('Quadro criado com sucesso')
  router.push('/')
}

function back() {
  router.push('/')
}
</script>

<template>
  <v-container class="p-8">
    <v-row>
      <h2 class="text-2xl mb-12">Criar novo quadro</h2>
      <v-spacer></v-spacer>
      <v-btn @click="back()" icon>
        <v-icon icon="mdi-arrow-left"></v-icon>
      </v-btn>
    </v-row>

    <v-form @submit.prevent="criarNovo">
      <v-text-field v-model="title" label="Título" required></v-text-field>
      <v-row no-gutters>
        <v-col cols="6">
          <p class="font-bold">Cor de fundo</p>
          <v-color-picker
            v-model="backgroundColor"
            required
            dot-size="25"
            mode="hex"
            swatches-max-height="100"
          ></v-color-picker>
        </v-col>
        <v-col cols="6">
          <p class="font-bold">Cor do texto</p>
          <v-color-picker
            v-model="textColor"
            required
            dot-size="25"
            mode="hex"
            swatches-max-height="200"
          ></v-color-picker>
        </v-col>
      </v-row>
      <v-btn class="mt-12" block color="primary" type="submit">Criar</v-btn>
    </v-form>
  </v-container>
</template>

<style scoped></style>
