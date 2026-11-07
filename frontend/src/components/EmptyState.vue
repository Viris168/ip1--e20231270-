<script setup lang="ts">
defineProps<{ title: string; message?: string }>();
</script>

<template>
  <div class="state-box">
    <div class="state-icon" aria-hidden="true">📭</div>
    <h2 class="state-title">{{ title }}</h2>
    <p v-if="message">{{ message }}</p>
    <slot />
  </div>
</template>
