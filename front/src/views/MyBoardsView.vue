<template>
  <div class="board-region">
    <div class="flex justify-items-center">
      <h1 class="board-title mr-5">Meus quadros</h1>
      <v-btn style="border-width: 2px;" icon="$plus" size="small">
      </v-btn>
    </div>
    <BoardComponent></BoardComponent>
  </div>
</template>

<style scoped>
  .board-region{
    margin: 2rem;
  }

  .board-title{
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 25px;
  }
</style>


