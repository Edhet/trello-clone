<script setup lang="ts">
  async function registerUser(e: Event) {
    e.preventDefault();
    console.log("Teste");
  }
</script>

<template>
  <div class="flex items-center justify-center h-screen">
    <div class="flex flex-col items-center justify-center border-2 h-96 p-6 login-containeir">
      <h1 class="font-bold mb-6">TrelloLike</h1>
      <h3>Entre com seus dados para realizar o Cadastro</h3>
      <form class="flex flex-col items-center justify-center" id="signup-form" @submit.prevent="registerUser">
        <input
          type="text"
          name="email"
          id="email"
          class="border rounded-sm p-2 my-2 w-64"
          placeholder="Insira seu e-mail"
        />
        <input
          type="text"
          name="password"
          id="password"
          class="border rounded-sm p-2 my-2 w-64"
          placeholder="Insira sua senha"
        />
        <button type="submit" class="bg-blue-500 text-white p-2 mt-6 rounded-sm w-32">Cadastrar</button>
      </form>
      <a href="" class="mt-6">Já possui login? Clique aqui!</a>
    </div>
  </div>
</template>

<style scoped>
  .login-container{
    width: 100%;
  }
  a:hover{
    color: blue;
    text-decoration: underline;
  }
</style>
