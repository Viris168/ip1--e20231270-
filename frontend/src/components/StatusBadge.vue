<script setup lang="ts">
import { computed } from 'vue';
import type { ApplicationStatus, ReviewDecision } from '@/types';

const props = defineProps<{
  status: ApplicationStatus | ReviewDecision;
}>();

const formattedLabel = computed(() => {
  return props.status.replace('_', ' ');
});

const badgeClass = computed(() => {
  return `badge badge-${props.status.toLowerCase()}`;
});
</script>

<template>
  <span :class="badgeClass">{{ formattedLabel }}</span>
</template>
