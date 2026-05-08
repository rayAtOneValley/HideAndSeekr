<template>
  <div class="pipeline-wrapper">
    <div class="pipeline-header">
      <h2 class="pipeline-title">
        <span class="title-icon">⚡</span>
        AI Agent Pipeline
      </h2>
      <div class="pipeline-progress">
        <span class="progress-text">{{ completedCount }}/{{ agents.length }} complete</span>
        <div class="progress-track">
          <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
        </div>
      </div>
    </div>

    <div class="pipeline-flow">
      <div
        v-for="(agent, index) in agents"
        :key="agent.id"
        class="pipeline-step"
      >
        <AgentActivityCard :agent="agent" />
        <div v-if="index < agents.length - 1" class="pipeline-connector" :class="{ 'connector--active': agent.status === 'complete' }">
          <div class="connector-line"></div>
          <span class="connector-arrow">→</span>
        </div>
      </div>
    </div>

    <div v-if="allComplete" class="pipeline-complete">
      <div class="complete-icon">✓</div>
      <div class="complete-text">
        <p class="complete-title">All agents complete</p>
        <p class="complete-sub">Your personalized event plan is ready</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AgentState } from "~/types/agents";

const props = defineProps<{
  agents: AgentState[];
  allComplete: boolean;
}>();

const completedCount = computed(() => props.agents.filter((a) => a.status === "complete").length);
const progressPercent = computed(() => (completedCount.value / props.agents.length) * 100);
</script>

<style scoped>
.pipeline-wrapper {
  max-width: 900px;
  margin: 0 auto;
}

.pipeline-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.pipeline-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  font-weight: 800;
  color: white;
  margin: 0;
}

.title-icon {
  font-size: 1rem;
}

.pipeline-progress {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.progress-text {
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.4);
  font-weight: 600;
  white-space: nowrap;
}

.progress-track {
  width: 120px;
  height: 4px;
  background: rgba(255, 255, 255, 0.07);
  border-radius: 100px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #7c3aed, #34d399);
  border-radius: 100px;
  transition: width 0.5s ease;
}

.pipeline-flow {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0;
  align-items: start;
}

@media (max-width: 900px) {
  .pipeline-flow {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 540px) {
  .pipeline-flow {
    grid-template-columns: 1fr;
  }
}

.pipeline-step {
  display: contents;
}

.pipeline-connector {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 0.25rem;
  padding-top: 1.25rem;
  opacity: 0.2;
  transition: opacity 0.4s ease;
}

.connector--active {
  opacity: 1;
}

.connector-line {
  display: none;
}

.connector-arrow {
  font-size: 1rem;
  color: #7c3aed;
}

@media (max-width: 900px) {
  .pipeline-connector {
    display: none;
  }
}

.pipeline-complete {
  margin-top: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  background: rgba(52, 211, 153, 0.06);
  border: 1px solid rgba(52, 211, 153, 0.2);
  border-radius: 12px;
  animation: fade-in 0.5s ease;
}

.complete-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(52, 211, 153, 0.15);
  border: 1px solid rgba(52, 211, 153, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #34d399;
  font-weight: 700;
  flex-shrink: 0;
}

.complete-title {
  font-size: 0.9375rem;
  font-weight: 700;
  color: #34d399;
  margin: 0 0 0.125rem;
}

.complete-sub {
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.4);
  margin: 0;
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
