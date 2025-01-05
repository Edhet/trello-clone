<template>
  <div class="flex items-center justify-center h-screen">
    <div class="flex flex-col items-center justify-center border-2 w-96 h-96 p-6">
      <div class="flex flex-col items-center justify-center mb-6">
        <h1 class="font-bold">TrelloLike</h1>
      </div>
      <p>Entre com seu e-mail e senha para realizar o login</p>
      <form action="">
        <input
          type="text"
          name=""
          id=""
          class="border rounded-sm p-2 my-2 w-64"
          placeholder="Insira seu e-mail"
        />
        <input
          type="text"
          name=""
          id=""
          class="border rounded-sm p-2 my-2 w-64"
          placeholder="Insira sua senha"
        />
        <button class="bg-blue-500 text-white p-2 mt-6 rounded-sm w-32">Login</button>
      </form>
      <a href="" class="mt-6">Não possui cadastro? Crie uma aqui!</a>
    </div>
  </div>
</template>

<style scoped>
  p{
    font-size: 0.9rem;
  }
  a:hover{
    color: blue;
    text-decoration: underline;
  }
</style>
