<script setup lang="ts">
import { useRouter } from 'vue-router'
import alertService from '@/services/alert.service.ts'
import requestService from '@/services/request.service.ts'
import type { emailModel } from '@/models/email.model'

const router = useRouter()

async function userResetPassword() {
  const form = document.querySelector('#resetPasswordForm') as HTMLFormElement
  const formdata = new FormData(form)

  const data: emailModel = {
    email: formdata.get('email') as string,
  }

  if (!data.email.trim()) {
    alertService.showError('O campo de email é obrigatório!')
    return
  }

  try {
    const response = await requestService.post('/user/reset-password', data)

    if (response.error) {
      const errorMessage =
        response.error.status === 500
          ? 'Ocorreu um erro ao tentar enviar o email. Tente novamente mais tarde.'
          : 'Não foi possível enviar o email. Verifique se o endereço está correto.'
      alertService.addAlert({ type: 'error', message: errorMessage })
      return
    }

    alertService.addAlert({
      type: 'success',
      message: 'Um email com instruções para recuperação de senha foi enviado. Verifique sua caixa de entrada.',
    })
    router.push('/login')
  } catch (error) {
    alertService.showError('Ocorreu um erro inesperado. Por favor, tente novamente mais tarde.')
  }
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
      id="resetPasswordForm"
      class="h-full bg-[#F3F5F6] w-[40%] p-10 flex flex-col gap-3 justify-center"
      @submit.prevent="userResetPassword"
    >
      <div>
        <v-text-field
          name="email"
          label="Email"
          placeholder="email@dominio.com"
          type="email"
        ></v-text-field>
      </div>
      <v-btn color="primary" type="submit">Enviar email de recuperação</v-btn>
      <div class="flex align-center gap-2 mt-4">
        <RouterLink class="underline" to="/login">Voltar</RouterLink>
      </div>
    </form>
  </div>
</template>
