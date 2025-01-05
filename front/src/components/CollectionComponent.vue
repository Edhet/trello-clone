<template>
  <div class="collection-container">
    <v-card
      title="Titulo da Coleção"
      class="collection-component"
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
      <v-card-actions>
        <v-btn>Adicionar um Quadro</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<style scoped>
  .collection-container{
    width: 25rem;
    margin: 5px;
  }
  .collection-component{
    border-width: 2px;
  }
</style>
