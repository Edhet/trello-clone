<template>
  <div class="board-container">
    <v-card
      title="Titulo do Quadro"
      color=""
      class="board-component"
    >
      <template v-slot:append>
          <v-btn
            class="text-none"
            color="primary"
            icon="mdi-pencil"
            variant="text"
            slim
          ></v-btn>
          <v-btn
            class="text-none"
            color="primary"
            icon="mdi-delete"
            variant="text"
            slim
          ></v-btn>
      </template>

      <v-divider class="border-opacity-100" thickness="2" ></v-divider>

      <v-card-text class="text-medium-emphasis pa-6">
        <div class="text-h6 mb-6 m-0 p-0">Descrição</div>
        <div>Descrição vai aqui</div>
      </v-card-text>
    </v-card>
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
