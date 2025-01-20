<script setup lang="ts">
import type { SignUpModel } from '@/models/sign-up.model.ts'
import requestService from '@/services/request.service.ts'
import { useRouter } from 'vue-router'
import alertService from '@/services/alert.service.ts'

const router = useRouter()

async function registerUser() {
  const form = document.querySelector('#registerForm') as HTMLFormElement
  const formdata = new FormData(form)

  const formField: SignUpModel = {
    name: formdata.get('username') as string,
    email: formdata.get('email') as string,
    password: formdata.get('password') as string,
    passwordConfirmation: formdata.get('passwordConfirmation') as string,
  }

  if (
    !formField.email.trim() ||
    !formField.name.trim() ||
    !formField.password.trim() ||
    !formField.passwordConfirmation.trim()
  ) {
    alertService.showError('Todos os campos são obrigatórios!')
    return
  }
  if (formField.password != formField.passwordConfirmation) {
    alertService.showError('As senhas são diferentes')
    return
  }

  const res = await requestService.post<{ jwt: string }>('/user/register', formdata)
  if (res.error) {
    alertService.showError(res.error.error)
    return
  }
  alertService.showSuccess('Conta criada com sucesso')
  router.push('/login')
}
</script>

<template>
  <div class="flex items-center h-[100vh]">
    <div class="w-[60%] p-10 flex flex-col gap-10 px-32">
      <h1>TaskFlow</h1>
      <p>
        Este aplicativo foi desenvolvido para ajudá-lo a organizar e gerenciar suas tarefas de forma
        eficiente, com uma interface simples e intuitiva, inspirada nas funcionalidades do Trello.
      </p>
      <p>
        Nosso objetivo é oferecer uma experiência prática e fluida para você se concentrar no que
        importa: alcançar seus objetivos. Prepare-se para começar a planejar seu sucesso!
      </p>
    </div>

    <form
      @submit.prevent="registerUser"
      id="registerForm"
      class="h-[100%] bg-[#F3F5F6] w-[40%] p-10 flex flex-col gap-3 justify-center"
    >
      <div>
        <v-text-field name="username" label="Nome" placeholder="meunome" type="text"></v-text-field>
        <v-text-field
          name="email"
          label="Email"
          placeholder="meu@gmail.com"
          type="email"
        ></v-text-field>
        <v-text-field
          name="password"
          label="Senha"
          type="password"
        ></v-text-field>
        <v-text-field
          name="passwordConfirmation"
          label="Confirme a Senha"
          type="password"
        ></v-text-field>
      </div>
      <v-btn color="primary" type="submit"> Criar conta</v-btn>
      <div class="flex align-center gap-2 mt-4">
        <p>Já possui conta?</p>
        <RouterLink class="underline" to="/login">Entrar</RouterLink>
      </div>
    </form>
  </div>
</template>
