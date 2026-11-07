<script setup lang="ts">
withDefaults(defineProps<{ message?: string }>(), {
  message: 'Loading...'
});
</script>

<template>
  <div class="state-box" role="status" aria-live="polite">
    <span class="spinner" aria-hidden="true"></span>
    <p>{{ message }}</p>
  </div>
</template>
