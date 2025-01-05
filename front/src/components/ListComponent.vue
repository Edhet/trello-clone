<template>
  <div class="list-container">
    <v-card title="Titulo da Lista" class="list-component">
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
        <v-btn>Adicionar um cartão</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<style scoped>
  .list-container{
    width: 25rem;
    margin: 5px;
  }
  .list-component{
    border-width: 2px;
  }
</style>

