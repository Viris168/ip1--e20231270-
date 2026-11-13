<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onBeforeUnmount } from 'vue';
import type { ApplicationStatus } from '@/types';

type FilterValue = ApplicationStatus | 'ALL';

const props = defineProps<{
  modelValue: FilterValue;
  counts: Record<FilterValue, number>;
}>();
const emit = defineEmits<{ 'update:modelValue': [value: FilterValue] }>();

const options: { value: FilterValue; label: string }[] = [
  { value: 'ALL', label: 'All statuses' },
  { value: 'DRAFT', label: 'Draft' },
  { value: 'APPLIED', label: 'Applied' },
  { value: 'INTERVIEWING', label: 'Interviewing' },
  { value: 'OFFERED', label: 'Offered' },
  { value: 'NEEDS_CHANGES', label: 'Needs changes' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'REJECTED', label: 'Rejected' }
];

// Open/closed and the highlighted row are pure UI state, so they stay in this component
const open = ref(false);
const activeIndex = ref(0);
const root = ref<HTMLElement | null>(null);
const trigger = ref<HTMLButtonElement | null>(null);
const listbox = ref<HTMLUListElement | null>(null);

const selected = computed(() => options.find((o) => o.value === props.modelValue) ?? options[0]);

function dotClass(value: FilterValue) {
  return `status-dot status-dot-${value.toLowerCase()}`;
}

async function openList() {
  open.value = true;
  activeIndex.value = Math.max(0, options.findIndex((o) => o.value === props.modelValue));
  await nextTick();
  listbox.value?.focus();
}

function close(returnFocus = true) {
  open.value = false;
  if (returnFocus) trigger.value?.focus();
}

function choose(index: number) {
  emit('update:modelValue', options[index].value);
  close();
}

function onTriggerKey(e: KeyboardEvent) {
  if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
    e.preventDefault();
    openList();
  }
}

function onListKey(e: KeyboardEvent) {
  const last = options.length - 1;
  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault();
      activeIndex.value = Math.min(last, activeIndex.value + 1);
      break;
    case 'ArrowUp':
      e.preventDefault();
      activeIndex.value = Math.max(0, activeIndex.value - 1);
      break;
    case 'Home':
      e.preventDefault();
      activeIndex.value = 0;
      break;
    case 'End':
      e.preventDefault();
      activeIndex.value = last;
      break;
    case 'Enter':
    case ' ':
      e.preventDefault();
      choose(activeIndex.value);
      break;
    case 'Escape':
      e.preventDefault();
      close();
      break;
    case 'Tab':
      close(false);
      break;
  }
}

function onDocumentClick(e: MouseEvent) {
  if (open.value && root.value && !root.value.contains(e.target as Node)) close(false);
}

onMounted(() => document.addEventListener('mousedown', onDocumentClick));
onBeforeUnmount(() => document.removeEventListener('mousedown', onDocumentClick));
</script>

<template>
  <div ref="root" class="status-filter">
    <button
      ref="trigger"
      type="button"
      class="status-filter-trigger"
      aria-haspopup="listbox"
      :aria-expanded="open"
      aria-label="Filter by status"
      @click="open ? close() : openList()"
      @keydown="onTriggerKey"
    >
      <span :class="dotClass(selected.value)" aria-hidden="true"></span>
      <span class="status-filter-label">{{ selected.label }}</span>
      <span class="status-filter-count">{{ counts[selected.value] }}</span>
      <svg class="status-filter-chevron" :class="{ open }" viewBox="0 0 20 20" aria-hidden="true">
        <path d="M5 7.5l5 5 5-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>

    <ul
      v-if="open"
      ref="listbox"
      class="status-filter-menu"
      role="listbox"
      tabindex="-1"
      aria-label="Status"
      :aria-activedescendant="'status-opt-' + options[activeIndex].value"
      @keydown="onListKey"
    >
      <li
        v-for="(opt, i) in options"
        :id="'status-opt-' + opt.value"
        :key="opt.value"
        role="option"
        :aria-selected="opt.value === modelValue"
        :class="['status-filter-option', { active: i === activeIndex, selected: opt.value === modelValue }]"
        @mouseenter="activeIndex = i"
        @click="choose(i)"
      >
        <span :class="dotClass(opt.value)" aria-hidden="true"></span>
        <span class="status-filter-label">{{ opt.label }}</span>
        <span class="status-filter-count">{{ counts[opt.value] }}</span>
        <svg v-if="opt.value === modelValue" class="status-filter-check" viewBox="0 0 20 20" aria-hidden="true">
          <path d="M4.5 10.5l3.5 3.5 7.5-8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </li>
    </ul>
  </div>
</template>
