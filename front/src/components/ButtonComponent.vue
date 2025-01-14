<script setup lang="ts">
defineProps<{texto: string, buttonFunction: ()=> void}>()
</script>

<template>
  <div class="flex flex-col gap-3">
   <button @click="buttonFunction" class="p-2 rounded-md text-gray-50 bg-gray-800">
     {{texto}}
   </button>
  </div>
</template>
