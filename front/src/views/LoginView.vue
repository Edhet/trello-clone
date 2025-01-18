<script setup lang="ts">
import InputComponent from '@/components/InputComponent.vue'
import ButtonComponent from '@/components/ButtonComponent.vue'
import type { ILogin } from '@/models/ILogin.ts'
import { useAuth } from '@/stores/auth'
import requestService from '@/services/requestService'
import { useRouter } from 'vue-router'
import alertService from '@/services/alertService.ts'

const auth = useAuth()
const router = useRouter()

async function userLogin() {
  const form = document.querySelector('#loginForm') as HTMLFormElement
  const formdata = new FormData(form)

  const dataLogin: ILogin = {
    email: formdata.get('email') as string,
    password: formdata.get('password') as string,
  }
  if (!dataLogin.email.trim() || !dataLogin.password.trim()) {
    alertService.showError('Todos os campos são obrigatórios!')
    return
  }

  const response = await requestService.post<{ jwt: string }>('/user/login', formdata)
  if (response.error) {
    const errorMessage =
      response.error.status == 500
        ? 'Ocorreu um erro ao tentar realizar o login. Tente novamente.'
        : 'Email ou senha inválidos.'
    alertService.addAlert({ type: 'error', message: errorMessage })
    return
  }

  auth.setToken(response.result!.jwt)
  router.push('/home')
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
      id="loginForm"
      class="h-[100%] bg-[#F3F5F6] w-[40%] p-10 flex flex-col gap-3 justify-center"
    >
      <InputComponent name="email" label="Email" placeholder="meu@gmail.com" type="email" />
      <InputComponent name="password" label="Senha" placeholder="******" type="password" />
      <ButtonComponent
        :buttonFunction="userLogin"
        id="botao"
        texto="Entrar!"
        textcolor="blue-300"
        bgcolor="gray-500"
        type="button"
      />
      <div class="flex align-center gap-2 mt-4">
        <p>Não possui conta?</p>
        <RouterLink class="underline" to="/cadastro">Cadastre-se</RouterLink>
      </div>
      <RouterLink to="/" class="font-weight-bold text-decoration-underline"
        >Esqueci minha senha</RouterLink
      >
    </form>
  </div>
</template>
