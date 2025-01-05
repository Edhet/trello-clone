<script setup lang="ts">
  import type LoginRegisterModel from '@/models/LoginRegisterModel';
  import { ref } from 'vue';

  const form = ref<LoginRegisterModel>({
    username: '',
    email: '',
    password: '',
  })

  async function userLogin(e: Event) {
    e.preventDefault();

    fetch('http://localhost:8080/user/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value),
    })
    .then(response => response.json())
    .then(data => console.log('Resposta do servidor:', data));
  }
</script>

<template>
  <div class="flex items-center justify-center h-screen">
    <div class="flex flex-col items-center justify-center border-2 w-96 h-96 p-6">
      <div class="flex flex-col items-center justify-center mb-6">
        <h1 class="font-bold">TrelloLike</h1>
      </div>
      <p>Entre com seu e-mail e senha para realizar o login</p>
      <form class="flex flex-col items-center justify-center" @submit.prevent="userLogin">
        <input
          type="email"
          name="email"
          id="email"
          class="border rounded-sm p-2 my-2 w-64"
          placeholder="Insira seu e-mail"
          v-model="form.email"
        />
        <input
          type="password"
          name="senha"
          id="senha"
          class="border rounded-sm p-2 my-2 w-64"
          placeholder="Insira sua senha"
          v-model="form.password"
        />
        <button class="bg-blue-500 text-white p-2 mt-6 rounded-sm w-32">Login</button>
      </form>
      <RouterLink class="cadastro-link mt-2" to="/cadastro">Não possui cadastro? Crie uma aqui!</RouterLink>
    </div>
  </div>
</template>

<style scoped>
  p{
    font-size: 0.9rem;
  }
  .cadastro-link:hover{
    color: blue;
    text-decoration: underline;
  }
</style>
