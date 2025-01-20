<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { boardsStore } from '@/stores/boards.store.ts'
import type { BoardAccessModel } from '@/models/board-access.model.ts'
import alertService from '@/services/alert.service.ts'
import { useRouter } from 'vue-router'
import NavBarComponent from '@/components/NavBarComponent.vue'
import ListComponent from '@/components/ListComponent.vue'
import { AccessType } from '@/models/access-type.enum.ts'
import { userInfoStore } from '@/stores/userInfo.store.ts'
import requestService from '@/services/request.service'
import type { ListModel } from '@/models/list.model'

const props = defineProps<{ id: string }>()
const router = useRouter()
const boardStore = boardsStore()
const userInfo = userInfoStore()

const loading = ref(true)
const editing = ref(false)

const newListName = ref('')
const sharing = ref({ email: '', type: undefined })

let board: BoardAccessModel

const listasOrdenadas = computed(() => {
  return board.board.lists.sort((a, b) => a.order - b.order)
})

onMounted(async () => {
  userInfo.fetch()
  loading.value = true
  await boardStore.fetchOne(props.id)
  const selected = boardStore.get().find((b) => b.board._id == props.id)
  if (!selected) {
    alertService.showError('Quadro não encontrado')
    return
  }
  board = selected
  loading.value = false
})

function back() {
  router.push('/')
}

async function editar() {
  if (
    !board.board.backgroundColor.trim() ||
    !board.board.textColor.trim() ||
    !board.board.title.trim()
  ) {
    alertService.showError('Todos os valores são obrigatórios')
    return
  }

  const res = await requestService.put<void>(`/boards/edit?id=${board.board._id}`, board.board)
  if (res.error) {
    alertService.showError(res.error!.error)
    return
  }
  alertService.showSuccess('Quadro alterado com sucesso')
  editing.value = false
}

async function criarLista() {
  if (!newListName.value.trim()) {
    alertService.showError('Nome para lista é obrigatório')
    return
  }

  const res = await requestService.post<ListModel>(`/lists/new?board-id=${board.board._id}`, {
    title: newListName.value,
  })
  if (res.error || !res.result) {
    alertService.showError(res.error!.error)
    return
  }

  board.board.lists.push(res.result)
  newListName.value = ''
  alertService.showSuccess('Quadro alterado com sucesso')
}

async function shareBoard() {
  if (!sharing.value || !sharing.value.email.trim() || !sharing.value.type) {
    alertService.showError('Todas as informações são obrigatórias')
    return
  }

  const res = await requestService.post<void>("/boards/grant", { boardId: board.board._id, userEmail: sharing.value.email, accessType: sharing.value.type })
  if (res.error) {
    alertService.showError(res.error.error)
    return
  }
  alertService.showSuccess("Quadro compartilhado com sucesso")
}
</script>

<template>
  <NavBarComponent :username="userInfo.userInfoRef?.username" />
  <v-container v-if="!loading" class="h-full">
    <v-row class="mt-5">
      <h2 class="text-2xl mb-12">Quadro</h2>
      <v-spacer></v-spacer>
      <v-btn @click="back()" icon>
        <v-icon icon="mdi-arrow-left"></v-icon>
      </v-btn>
    </v-row>

    <div class="h-full">
      <v-row class="mb-8 flex items-center">
        <h1>{{ board.board.title }}</h1>
        <v-btn :disabled="board.type == AccessType.READ_ONLY" @click="editing = !editing" color="primary"
          icon="mdi-pencil" variant="text" slim class="ml-5"></v-btn>
      </v-row>

      <div v-if="editing">
        <v-form @submit.prevent="editar" :disabled="board.type == AccessType.READ_ONLY">
          <h3 class="text-2xl mb-4">Alterar dados do quadro</h3>
          <v-text-field v-model="board.board.title" label="Título" required></v-text-field>
          <v-row no-gutters>
            <v-col cols="6">
              <p class="font-bold">Cor de fundo</p>
              <v-color-picker v-model="board.board.backgroundColor" required dot-size="25" mode="hex"
                swatches-max-height="100"></v-color-picker>
            </v-col>
            <v-col cols="6">
              <p class="font-bold">Cor do texto</p>
              <v-color-picker v-model="board.board.textColor" required dot-size="25" mode="hex"
                swatches-max-height="200"></v-color-picker>
            </v-col>
          </v-row>
          <v-btn class="mt-6" block color="primary" type="submit">Alterar</v-btn>
        </v-form>

        <v-form @submit.prevent="shareBoard" :disabled="board.type == AccessType.READ_ONLY">
          <h3 class="text-2xl mt-24 mb-4">Alterar permissões do quadro</h3>
          <v-text-field v-model="sharing.email" required type="email" placeholder="amigo@email.com" label="Email"></v-text-field>
          <v-select v-model="sharing.type" required
            label="Tipo de acesso"
            :items="[AccessType.READ_ONLY, AccessType.EDIT]"
          ></v-select>
          <v-btn class="mt-6" block color="primary" type="submit">Dar acesso</v-btn>

        </v-form>
      </div>
      <v-divider></v-divider>

<div v-if="!editing">
  <v-row class="mt-12">
    <v-text-field label="Nome da lista" v-model="newListName" :disabled="board.type == AccessType.READ_ONLY"></v-text-field>
    <v-btn @click="criarLista()" icon="mdi-plus" :disabled="board.type == AccessType.READ_ONLY"></v-btn>
  </v-row>
  <div class="flex overflow-x-auto gap-6 h-full">
    <template v-for="list in listasOrdenadas" :key="list._id">
      <list-component
        :disabled="board.type == AccessType.READ_ONLY"
        :lista="list"
        :board="board"
        :bg-color="board.board.backgroundColor"
        :text-color="board.board.textColor"
      ></list-component>
    </template>
  </div>
      </div>
    </div>
  </v-container>
</template>
