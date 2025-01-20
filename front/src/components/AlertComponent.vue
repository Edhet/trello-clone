<script setup lang="ts">
import { computed } from 'vue'
import alertService from '@/services/alert.service.ts'

const alert = computed(() => alertService.getAlerts())
</script>

<template>
  <v-alert
    style="position: fixed; bottom: 0; left: 25%; width: 50%; transform: translateY(-50%)"
    v-if="alert"
    :color="alert.type == 'success' ? 'green' : alert.type == 'error' ? 'red' : 'blue'"
    dense
    prominent
    :type="alert.type"
    >{{ alert.message }}
  </v-alert>
</template>
