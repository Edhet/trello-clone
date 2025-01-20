<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { boardsStore } from '@/stores/boards.store.ts'
import {listsStore} from '@/stores/lists.store'
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
const listStore = listsStore()
const userInfo = userInfoStore()

const loading = ref(true)
const editing = ref(false)
const creatingList = ref(false)
const listTitle = ref()

let board: BoardAccessModel

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

async function newListScreen() {
  if (!listTitle.value.trim()) {
    alertService.showError('Todos os valores são obrigatórios')
    return
  }
  const res = await requestService.post<ListModel>(`lists/new?board-id=${board.board._id}`, {
    title: listTitle.value
  })
  if (res.error || !res.result) {
    alertService.showError(res.error!.error)
    return
  }

  await listStore.fetchOne(res.result._id)
  alertService.showSuccess('Quadro criado com sucesso')
}

async function deleteList(list: ListModel) {
  const res = await requestService.delete<void>(`/lists/delete?board-id=${board.board._id}&id=${list._id}`)
  if (res.error) {
    alertService.showError(res.error.error)
    return
  }

  listStore.set(listStore.get().filter((l) => l._id != list._id))
  alertService.showSuccess('Lista excluída com sucesso')
}

function back() {
  router.push('/')
}

function editar() { }

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
        <v-form @submit.prevent="editar">
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
          <v-btn class="mt-12 mb-12" block color="primary" type="submit">Alterar</v-btn>
        </v-form>
      </div>
      <v-row class="mb-8 flex items-center">
        <h2>Adicionar Lista</h2>
        <v-btn @click="creatingList = !creatingList" class="ml-5" icon="$plus" size="small"></v-btn>
      </v-row>

      <div v-if="creatingList">
        <v-form @submit.prevent="newListScreen">
          <v-text-field v-model="listTitle" label="Título" required></v-text-field>
          <v-btn class="mb-12" block color="primary" type="submit">Adicionar</v-btn>
        </v-form>
      </div>

      <div class="flex overflow-x-auto h-full">
        <template v-for="list in board.board.lists" :key="list._id">
          <list-component :list="list" @delete="deleteList" :lista="list" :bg-color="board.board.backgroundColor"
            :text-color="board.board.textColor"></list-component>
        </template>
      </div>
    </div>
  </v-container>
</template>
