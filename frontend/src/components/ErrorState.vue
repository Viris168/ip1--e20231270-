<script setup lang="ts">
defineProps<{ message: string }>();
const emit = defineEmits<{ retry: [] }>();
</script>

<template>
  <div class="state-box state-error" role="alert">
    <div class="state-icon" aria-hidden="true">⚠️</div>
    <h2 class="state-title">Something went wrong</h2>
    <p>{{ message }}</p>
    <button type="button" class="btn btn-primary btn-sm" @click="emit('retry')">Try again</button>
  </div>
</template>
