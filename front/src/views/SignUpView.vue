<script setup lang="ts">
import InputComponent from "@/components/InputComponent.vue"
import ButtonComponent from "@/components/ButtonComponent.vue"
import type {ISingUp} from "@/models/ISingUp.ts";
import { ref } from 'vue';
import type LoginRegisterModel from '@/models/LoginRegisterModel';
import requestService from '@/services/requestService'


async function registerUser(e: SubmitEvent) {
  e.preventDefault()
  const form = document.querySelector('#loginForm') as HTMLFormElement
  const formdata = new FormData(form)

  const data :ISingUp = {
    name: formdata.get('name') as string,
    email: formdata.get('email') as string,
    password: formdata.get('password') as string,
    passwordConfirmation: formdata.get('passwordConfirmation') as string
  }
  if(!data.email.trim() || !data.name.trim() || !data.password.trim() || !data.passwordConfirmation.trim()) {
    alert("Todos os campos são obrigatórios!");
    return;
  }
  console.log(data)

  const response = await fetch('http://localhost:8080/user/register', {
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
      <InputComponent name="name" label="Nome" placeholder="meunome"/>
      <InputComponent name="email" label="Email" placeholder="meu@gmail.com"/>
      <InputComponent name="password"  label="Senha" placeholder="******"/>
      <InputComponent name="passwordConfirmation"  label="Confirme a Senha" placeholder="******"/>
      <ButtonComponent :buttonFunction ="registerUser" id="botao" texto="Cadastrar" textcolor="blue-300" bgcolor="gray-500"/>

      <div class="flex flex-col align-center gap-4">
        <p>Já possui conta?</p>
        <RouterLink class="p-3 bg-gray-300 rounded-md border-solid" to="/login">Entrar</RouterLink>
      </div>

    </form>

  </div>
</template>

