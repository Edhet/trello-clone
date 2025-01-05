<template>
  <div class="card-container">
    <v-card
      title="Titulo do Cartão"
      subtitle="Data de Criação"
      class="card-component"
    >
      <template v-slot:append>
          <v-btn
            class="text-none"
            color="primary"
            icon="mdi-pencil"
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
  .card-container{
    width: 20rem;
    margin: 5px;
  }
  .card-component{
    border-width: 2px;
  }
</style>
