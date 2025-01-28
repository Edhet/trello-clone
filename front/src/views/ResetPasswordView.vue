<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import alertService from '@/services/alert.service.ts'
import requestService from '@/services/request.service.ts'

const router = useRouter()
const route = useRoute()

async function updateUser() {
  const form = document.querySelector('#updateUserForm') as HTMLFormElement;
  const formdata = new FormData(form);

  const novaSenha = formdata.get('newPassword') as string;
  const passwordConfirmation = formdata.get('passwordConfirmation') as string;

  if (!novaSenha.trim() || !passwordConfirmation.trim()) {
    alertService.showError('Todos os campos são obrigatórios!');
    return;
  }
  if (novaSenha !== passwordConfirmation) {
    alertService.showError('As senhas são diferentes');
    return;
  }

  const token = route.query.token as string;
  if (!token) {
    alertService.showError('Token inválido ou ausente!');
    return;
  }

  const res = await requestService.post('/user/change-pwd', { novaSenha }, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  if (res.error) {
    alertService.showError(res.error.error);
    return;
  }

  alertService.showSuccess('Senha Atualizada com Sucesso!');
  router.push('/login');
}

</script>

<template>
  <div class="flex items-center justify-center h-[100vh]">
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

    <form @submit.prevent="updateUser" id="updateUserForm"
    class="bg-[#F3F5F6] w-[40%] p-10 flex flex-col gap-3 rounded-lg shadow-lg">
    <div>
      <v-text-field name="newPassword" label="Senha" type="password"></v-text-field>
      <v-text-field name="passwordConfirmation" label="Confirme a Senha" type="password"></v-text-field>
    </div>
    <v-btn color="primary" type="submit">
      Atualizar Conta
    </v-btn>
  </form>
  </div>
</template>
