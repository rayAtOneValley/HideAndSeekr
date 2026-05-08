<template>
  <header class="app-header">
    <div class="header-inner">
      <div class="header-brand">
        <div class="brand-icon">
          <span class="brand-emoji">✦</span>
        </div>
        <div class="brand-text">
          <span class="brand-name">Sens<span class="brand-ai">AI</span></span>

        </div>
      </div>

      <div class="header-tagline">
        <span class="tagline-dot"></span>
        AI-Powered Event Concierge
      </div>

      <div class="header-actions">
        <div class="status-badge" :class="statusClass">
          <span class="status-dot"></span>
          {{ statusLabel }}
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const props = defineProps<{
  status?: "idle" | "searching" | "ready";
}>();

const statusClass = computed(() => {
  const s = props.status || "idle";
  return {
    "status-idle": s === "idle",
    "status-searching": s === "searching",
    "status-ready": s === "ready"
  };
});

const statusLabel = computed(() => {
  const s = props.status || "idle";
  if (s === "searching") return "Agents Running";
  if (s === "ready") return "Results Ready";
  return "Ready";
});
</script>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(10, 10, 15, 0.85);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.header-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1.5rem;
  height: 64px;
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.header-brand {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  flex-shrink: 0;
}

.brand-icon {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #7c3aed, #4f46e5);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 20px rgba(124, 58, 237, 0.4);
}

.brand-emoji {
  font-size: 16px;
  color: white;
}

.brand-text {
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
}

.brand-name {
  font-size: 1.125rem;
  font-weight: 700;
  color: white;
  letter-spacing: -0.02em;
}

.brand-ai {
  font-size: 1.125rem;
  font-weight: 700;
  color: #7c3aed;
  background: rgba(124, 58, 237, 0.15);
  padding: 2px 3px;
  border-radius: 4px;
  border: 1px solid rgba(124, 58, 237, 0.3);
}

.header-tagline {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.35);
  flex: 1;
}

.tagline-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  flex-shrink: 0;
}

@media (max-width: 640px) {
  .header-tagline {
    display: none;
  }
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.875rem;
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 600;
  border: 1px solid;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.status-idle {
  color: rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.08);
}

.status-idle .status-dot {
  background: rgba(255, 255, 255, 0.3);
}

.status-searching {
  color: #a78bfa;
  background: rgba(124, 58, 237, 0.1);
  border-color: rgba(124, 58, 237, 0.3);
}

.status-searching .status-dot {
  background: #7c3aed;
  animation: pulse-dot 1s ease-in-out infinite;
}

.status-ready {
  color: #34d399;
  background: rgba(52, 211, 153, 0.1);
  border-color: rgba(52, 211, 153, 0.3);
}

.status-ready .status-dot {
  background: #34d399;
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.8); }
}
</style>
