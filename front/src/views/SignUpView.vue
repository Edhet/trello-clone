<script setup lang="ts">
import InputComponent from "@/components/InputComponent.vue"
import ButtonComponent from "@/components/ButtonComponent.vue"
import type { ISingUp } from "@/models/ISingUp.ts"
import requestService from '@/services/requestService'
import { useRouter } from 'vue-router'

const router = useRouter();

async function registerUser() {
  const form = document.querySelector('#loginForm') as HTMLFormElement
  const formdata = new FormData(form)

  const formField: ISingUp = {
    name: formdata.get('username') as string,
    email: formdata.get('email') as string,
    password: formdata.get('password') as string,
    passwordConfirmation: formdata.get('passwordConfirmation') as string
  }
  if (!formField.email.trim() || !formField.name.trim() || !formField.password.trim() || !formField.passwordConfirmation.trim()) {
    alert("Todos os campos são obrigatórios!");
    return;
  }

  await requestService.post('/user/register', formdata)
  router.push("/login");

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
      <InputComponent name="username" label="Nome" placeholder="meunome" type="text" />
      <InputComponent name="email" label="Email" placeholder="meu@gmail.com" type="email" />
      <InputComponent name="password" label="Senha" placeholder="******" type="password" />
      <InputComponent name="passwordConfirmation" label="Confirme a Senha" placeholder="******" type="password" />
      <ButtonComponent :buttonFunction="registerUser" id="botao" texto="Cadastrar" type="button" />

      <div class="flex flex-col align-center gap-4">
        <p>Já possui conta?</p>
        <RouterLink class="p-3 bg-gray-300 rounded-md border-solid" to="/login">Entrar</RouterLink>
      </div>

    </form>

  </div>
</template>
