<template>
  <div class="app-shell">
    <AppHeader :status="headerStatus" />
    <main class="app-main">
      <slot />
    </main>
    <footer class="app-footer">
      <p>SensAI · Powered by SeekrFlow · Built for Hackathon 2025</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  headerStatus?: "idle" | "searching" | "ready";
}>();
</script>

<style scoped>
.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #080810;
}

.app-main {
  flex: 1;
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

.app-footer {
  text-align: center;
  padding: 1.5rem;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.2);
  border-top: 1px solid rgba(255, 255, 255, 0.04);
}
</style>
