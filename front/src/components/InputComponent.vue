<script setup lang="ts">
  defineProps<{label: string, placeholder: string, name: string, type: string}>()
</script>

<template>
  <div class="flex flex-col gap-3">
    <label class=""> {{ label }} </label>
    <input :name="name" :placeholder="placeholder" :type="type" class="p-2 bg-white rounded-md border-solid border-2 border-black">
  </div>
</template>
