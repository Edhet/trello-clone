<script setup lang="ts">
import { onMounted, ref } from 'vue'
import InputComponent from '@/components/InputComponent.vue'
import alertService from '@/services/alert.service.ts'
import { useRouter } from 'vue-router'
import NavBarComponent from '@/components/NavBarComponent.vue'
import { userInfoStore } from '@/stores/userInfo.store.ts'
import requestService from '@/services/request.service.ts'
import { useAuth } from '@/stores/auth.store.ts'

const auth = useAuth()
const router = useRouter()
const userInfo = userInfoStore()

const loading = ref(true)

onMounted(async () => {
  userInfo.fetch()
})

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

  const res = await requestService.post('/user/change-pwd', { novaSenha }, {
    headers: { 'Content-Type': 'application/json' }
  });

  if (res.error) {
    alertService.showError(res.error.error);
    return;
  }

  alertService.showSuccess('Senha Atualizada com Sucesso!');
  auth.logOut();
  router.push('/login');
}

</script>


<template>
    <NavBarComponent :username="userInfo.userInfoRef?.username" />
   <form
      @submit.prevent="updateUser"
      id="updateUserForm"
      class="h-[100%] bg-[#F3F5F6] w-[100%] p-10 flex flex-col gap-3 "
    >
      <InputComponent :disabled=true name="username" label="Nome" :placeholder=userInfo.userInfoRef!.username type="text" />
      <InputComponent :disabled=true name="email" label="Email" :placeholder=userInfo.userInfoRef!.email type="email" />
      <InputComponent name="newPassword" label="Nova senha" placeholder="******" type="password"/>
      <InputComponent name="passwordConfirmation" label="Confirme a nova senha" placeholder="******" type="password"/>
      <v-btn color="primary" type="submit">
        Atualizar Conta
      </v-btn>
    </form>
</template>
