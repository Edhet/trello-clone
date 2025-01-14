<script setup lang="ts">
import InputComponent from "@/components/InputComponent.vue"
import ButtonComponent from "@/components/ButtonComponent.vue"
import type {ILogin} from "@/models/ILogin.ts";
import { ref } from 'vue';
import { useAuth } from '@/stores/auth';
import type LoginRegisterModel from '@/models/LoginRegisterModel';
import requestService from '@/services/requestService';
import { useRouter, useRoute } from 'vue-router';

const auth = useAuth();
const router = useRouter();
const route = useRoute();


  async function userLogin(e: SubmitEvent) {
    e.preventDefault();
    try {
      const { data } = await requestService.post('/user/login', form.value)
      auth.setToken(data.jwt)
      const redirectPath = route.query.redirect || '/';
      router.push(redirectPath as string);
    } catch (error) {
      console.log(error)
    }
    const form = document.querySelector('#loginForm') as HTMLFormElement
    const formdata = new FormData(form)

    const data : ILogin = {
      email: formdata.get('email') as string,
      password: formdata.get('password') as string,
    }
    if(!data.email.trim() || !data.password.trim() ) {
      alert("Todos os campos são obrigatórios!");
      return;
    }
    console.log(data)

    const response = await fetch('http://localhost:8080/user/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const dadosServidor = await response.json()

    console.log('resposta da api', dadosServidor)
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
      <InputComponent name="email" label="Email" placeholder="meu@gmail.com"/>
      <InputComponent name="password"  label="Senha" placeholder="******"/>
      <RouterLink to="/" class="font-weight-bold text-decoration-underline">Esqueci minha senha</RouterLink>
      <ButtonComponent :buttonFunction ="userLogin" id="botao" texto="Enviar!" textcolor="blue-300" bgcolor="gray-500"/>

      <div class="flex flex-col align-center gap-4">
        <p>Não possui conta?</p>
        <RouterLink class="p-3 bg-gray-300 rounded-md border-solid" to="/cadastro">Cadastre-se</RouterLink>
      </div>

    </form>

  </div>
</template>
