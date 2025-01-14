<template>
  <v-layout>
    <v-navigation-drawer floating class="bg-deep-purple" theme="dark" permanent>
      <v-list nav>
        <RouterLink to="/quadros"><v-list-item prepend-icon="mdi-view-dashboard" title="Quadros"
            value="quadros"></v-list-item></RouterLink>
        <v-list-item prepend-icon="mdi-forum" title="Coleções" value="colecoes"></v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main style="height: 100%">
      <RouterView />
    </v-main>
  </v-layout>
</template>
