<script setup lang="ts">
import InputComponent from "@/components/InputComponent.vue"
import ButtonComponent from "@/components/ButtonComponent.vue"
import type { ILogin } from "@/models/ILogin.ts";
import { useAuth } from '@/stores/auth';
import requestService from '@/services/requestService';
import { useRouter } from 'vue-router';
import { ref } from 'vue'

const auth = useAuth();
const router = useRouter();
const errorMessage = ref('');

async function userLogin() {

  errorMessage.value = '';

  const form = document.querySelector('#loginForm') as HTMLFormElement
  const formdata = new FormData(form)

  const dataLogin: ILogin = {
    email: formdata.get('email') as string,
    password: formdata.get('password') as string,
  }
  if (!dataLogin.email.trim() || !dataLogin.password.trim()) {
    alert("Todos os campos são obrigatórios!");
    return;
  }

  try {
    const response = await requestService.post('/user/login', formdata)
    auth.setToken(response.data.jwt)
    router.push('/home');
  } catch (error) {
    errorMessage.value = (error.response.status === 500)
      ? 'Ocorreu um erro ao tentar realizar o login. Tente novamente.'
      : 'Email ou senha inválidos.';
    alert(errorMessage.value);
  }
}
</script>

<template>
  <div class="flex items-center h-[100vh]">

    <div class="w-[60%] p-10 flex flex-col gap-10 px-32">
      <h1> TaskFlow</h1>
      <p> Este aplicativo foi desenvolvido para ajudá-lo a organizar
        e gerenciar suas tarefas de forma eficiente,
        com uma interface simples e intuitiva,
        inspirada nas funcionalidades do Trello.</p>
      <p> Nosso objetivo é oferecer uma experiência
        prática e fluida para você se concentrar no
        que importa: alcançar seus objetivos.
        Prepare-se para começar a planejar seu sucesso!</p>
    </div>

    <form id="loginForm" class=" h-[100%] bg-[#F3F5F6] w-[40%] p-10 flex flex-col gap-3 justify-center">
      <InputComponent name="email" label="Email" placeholder="meu@gmail.com" type="email" />
      <InputComponent name="password" label="Senha" placeholder="******" type="password" />
      <RouterLink to="/" class="font-weight-bold text-decoration-underline">Esqueci minha senha</RouterLink>
      <ButtonComponent :buttonFunction="userLogin" id="botao" texto="Enviar!" textcolor="blue-300" bgcolor="gray-500"
        type="button" />
      <p v-if="errorMessage">{{ errorMessage }}</p>
      <div class="flex flex-col align-center gap-4">
        <p>Não possui conta?</p>
        <RouterLink class="p-3 bg-gray-300 rounded-md border-solid" to="/cadastro">Cadastre-se</RouterLink>
      </div>

    </form>

  </div>
</template>
