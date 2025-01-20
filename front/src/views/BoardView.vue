<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { boardsStore } from '@/stores/boards.store.ts'
import type { BoardAccessModel } from '@/models/board-access.model.ts'
import alertService from '@/services/alert.service.ts'
import { useRouter } from 'vue-router'
import ListComponent from '@/components/ListComponent.vue'
import { AccessType } from '@/models/access-type.enum.ts'

const props = defineProps<{ id: string }>()
const router = useRouter()
const boardStore = boardsStore()

const loading = ref(true)
const editing = ref(false)

let board: BoardAccessModel

onMounted(async () => {
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

function editar() {}
</script>

<template>
  <v-container v-if="!loading" class="h-full">
    <v-row>
      <h2 class="text-2xl mb-12">Quadro</h2>
      <v-spacer></v-spacer>
      <v-btn @click="back()" icon>
        <v-icon icon="mdi-arrow-left"></v-icon>
      </v-btn>
    </v-row>

    <div class="h-full">
      <v-row class="mb-8">
        <h1>{{ board.board.title }}</h1>
        <v-btn
          :disabled="board.type == AccessType.READ_ONLY"
          @click="editing = !editing"
          color="primary"
          icon="mdi-pencil"
          variant="text"
          slim
        ></v-btn>
      </v-row>

      <div v-if="editing">
        <v-form @submit.prevent="editar">
          <v-text-field v-model="board.board.title" label="Título" required></v-text-field>
          <v-row no-gutters>
            <v-col cols="6">
              <p class="font-bold">Cor de fundo</p>
              <v-color-picker
                v-model="board.board.backgroundColor"
                required
                dot-size="25"
                mode="hex"
                swatches-max-height="100"
              ></v-color-picker>
            </v-col>
            <v-col cols="6">
              <p class="font-bold">Cor do texto</p>
              <v-color-picker
                v-model="board.board.textColor"
                required
                dot-size="25"
                mode="hex"
                swatches-max-height="200"
              ></v-color-picker>
            </v-col>
          </v-row>
          <v-btn class="mt-12" block color="primary" type="submit">Alterar</v-btn>
        </v-form>
      </div>
      <div class="flex overflow-x-auto h-full">
        <template v-for="list in board.board.lists" :key="list._id">
          <list-component :lista="list" :bg-color="board.board.backgroundColor" :text-color="board.board.textColor"></list-component>
        </template>
      </div>
    </div>
  </v-container>
</template>
