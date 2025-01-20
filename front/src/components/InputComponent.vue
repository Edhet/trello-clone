<script setup lang="ts">
  defineProps<{label: string, placeholder: string, name: string, type: string, disabled?: boolean}>()
</script>

<template>
  <div class="flex flex-col gap-3">
    <label class=""> {{ label }} </label>
    <input :disabled="disabled"  :name="name" :placeholder="placeholder" :type="type" class="p-2 bg-white rounded-md border-solid border-2 border-black">
  </div>
</template>
