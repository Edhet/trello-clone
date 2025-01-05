<script setup lang="ts">
  import type LoginRegisterModel from '@/models/LoginRegisterModel';
  import { ref } from 'vue';

  const form = ref<LoginRegisterModel>({
    username: '',
    email: '',
    password: '',
  })

  async function registerUser(e: Event) {
    e.preventDefault();

    fetch('http://localhost:8080/user/register', {
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
    <div class="flex flex-col items-center justify-center border-2 h-96 p-6 login-containeir">
      <h1 class="font-bold mb-6">TrelloLike</h1>
      <h3>Entre com seus dados para realizar o Cadastro</h3>
      <form class="flex flex-col items-center justify-center" id="signup-form" @submit.prevent="registerUser">
        <input
          v-model="form.username"
          type="text"
          name="username"
          id="username"
          class="border rounded-sm p-2 my-2 w-64"
          placeholder="Insira seu nome de usuário"
          required
        />
        <input
          v-model="form.email"
          type="email"
          name="email"
          id="email"
          class="border rounded-sm p-2 my-2 w-64"
          placeholder="Insira seu e-mail"
          required
        />
        <input
          v-model="form.password"
          type="password"
          name="password"
          id="password"
          class="border rounded-sm p-2 my-2 w-64"
          placeholder="Insira sua senha"
          required
        />
        <button type="submit" class="bg-blue-500 text-white p-2 mt-6 rounded-sm w-32">Cadastrar</button>
      </form>
      <RouterLink class="login-link mt-2" to="/login">Já possui login? Clique aqui!</RouterLink>
    </div>
  </div>
</template>

<style scoped>
  .login-container{
    width: 100%;
  }
  .login-link:hover{
    color: blue;
    text-decoration: underline;
  }
</style>
