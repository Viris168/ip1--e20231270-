<script setup lang="ts">
import Navbar from '@/components/Navbar.vue';
</script>

<template>
  <div class="app-container">
    <Navbar />
    <main class="main-content">
      <router-view />
    </main>
    <footer class="footer">
      <p>
        <strong>Student Internship Tracker</strong> · Internet Programming I (ITC 2025–2026) · SOK Vireak (<code>e20231270</code>)
      </p>
    </footer>
  </div>
</template>
