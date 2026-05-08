<template>
  <div class="agent-card" :class="`agent-card--${agent.status}`">
    <div class="agent-header">
      <div class="agent-icon-wrap">
        <span class="agent-icon">{{ agent.icon }}</span>
        <div v-if="agent.status === 'running'" class="agent-pulse"></div>
      </div>
      <div class="agent-meta">
        <h3 class="agent-name">{{ agent.name }}</h3>
        <p class="agent-desc">{{ agent.description }}</p>
      </div>
      <div class="agent-status-badge" :class="`badge--${agent.status}`">
        <span v-if="agent.status === 'running'" class="badge-spinner"></span>
        <span v-else-if="agent.status === 'complete'" class="badge-check">✓</span>
        <span v-else-if="agent.status === 'failed'" class="badge-x">✕</span>
        <span v-else class="badge-dot"></span>
        {{ STATUS_LABELS[agent.status] }}
      </div>
    </div>

    <div v-if="agent.status !== 'idle'" class="agent-body">
      <div v-if="agent.completedTasks.length" class="tasks-list">
        <div
          v-for="task in agent.completedTasks"
          :key="task.id"
          class="task-item"
        >
          <span class="task-check">✓</span>
          <span class="task-text">{{ task.description }}</span>
        </div>
        <div v-if="agent.status === 'running'" class="task-item task-item--running">
          <span class="task-spinner"></span>
          <span class="task-text task-text--dim">Processing...</span>
        </div>
      </div>

      <div v-if="agent.status === 'running' && !agent.completedTasks.length" class="tasks-list">
        <div class="task-item task-item--running">
          <span class="task-spinner"></span>
          <span class="task-text task-text--dim">Initializing...</span>
        </div>
      </div>

      <div v-if="agent.reasoning && agent.status === 'complete'" class="agent-reasoning">
        <p class="reasoning-label">Agent Reasoning</p>
        <p class="reasoning-text">{{ agent.reasoning }}</p>
      </div>

      <div v-if="agent.confidenceScore && agent.status === 'complete'" class="confidence-row">
        <span class="confidence-label">Confidence</span>
        <div class="confidence-bar-wrap">
          <div class="confidence-bar">
            <div class="confidence-fill" :style="{ width: agent.confidenceScore + '%' }"></div>
          </div>
          <span class="confidence-value">{{ agent.confidenceScore }}%</span>
        </div>
      </div>
    </div>

    <div v-if="agent.status === 'idle'" class="agent-idle">
      <span class="idle-dots">
        <span></span><span></span><span></span>
      </span>
      Waiting to run
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AgentState } from "~/types/agents";

defineProps<{
  agent: AgentState;
}>();

const STATUS_LABELS = {
  idle: "Idle",
  running: "Running",
  complete: "Complete",
  failed: "Failed"
};
</script>

<style scoped>
.agent-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 16px;
  padding: 1.25rem;
  transition: all 0.4s ease;
}

.agent-card--running {
  border-color: rgba(124, 58, 237, 0.35);
  background: rgba(124, 58, 237, 0.04);
  box-shadow: 0 0 30px rgba(124, 58, 237, 0.1);
}

.agent-card--complete {
  border-color: rgba(52, 211, 153, 0.3);
  background: rgba(52, 211, 153, 0.03);
}

.agent-card--failed {
  border-color: rgba(239, 68, 68, 0.3);
  background: rgba(239, 68, 68, 0.03);
}

.agent-header {
  display: flex;
  align-items: flex-start;
  gap: 0.875rem;
}

.agent-icon-wrap {
  position: relative;
  flex-shrink: 0;
}

.agent-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.agent-pulse {
  position: absolute;
  inset: -4px;
  border-radius: 14px;
  border: 2px solid rgba(124, 58, 237, 0.5);
  animation: pulse-ring 1.5s ease-out infinite;
}

@keyframes pulse-ring {
  0% { opacity: 1; transform: scale(1); }
  100% { opacity: 0; transform: scale(1.3); }
}

.agent-meta {
  flex: 1;
  min-width: 0;
}

.agent-name {
  font-size: 0.9375rem;
  font-weight: 700;
  color: white;
  margin: 0 0 0.125rem;
}

.agent-desc {
  font-size: 0.78125rem;
  color: rgba(255, 255, 255, 0.4);
  margin: 0;
}

.agent-status-badge {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.25rem 0.625rem;
  border-radius: 100px;
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  flex-shrink: 0;
  border: 1px solid;
}

.badge--idle {
  color: rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.03);
  border-color: rgba(255, 255, 255, 0.07);
}

.badge--running {
  color: #a78bfa;
  background: rgba(124, 58, 237, 0.15);
  border-color: rgba(124, 58, 237, 0.4);
}

.badge--complete {
  color: #34d399;
  background: rgba(52, 211, 153, 0.1);
  border-color: rgba(52, 211, 153, 0.3);
}

.badge--failed {
  color: #f87171;
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.3);
}

.badge-spinner {
  width: 8px;
  height: 8px;
  border: 1.5px solid rgba(167, 139, 250, 0.3);
  border-top-color: #a78bfa;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  display: inline-block;
}

.badge-check, .badge-x, .badge-dot {
  font-size: 8px;
  line-height: 1;
}

.badge-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  display: inline-block;
}

.agent-body {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.tasks-list {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  margin-bottom: 0.875rem;
}

.task-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.6);
}

.task-item--running {
  color: rgba(167, 139, 250, 0.6);
}

.task-check {
  color: #34d399;
  font-size: 0.75rem;
  font-weight: 700;
  flex-shrink: 0;
}

.task-spinner {
  width: 10px;
  height: 10px;
  border: 1.5px solid rgba(167, 139, 250, 0.2);
  border-top-color: rgba(167, 139, 250, 0.7);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  display: inline-block;
  flex-shrink: 0;
}

.task-text--dim {
  opacity: 0.5;
}

.agent-reasoning {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  padding: 0.75rem;
  margin-bottom: 0.75rem;
}

.reasoning-label {
  font-size: 0.6875rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.35);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin: 0 0 0.375rem;
}

.reasoning-text {
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.55);
  line-height: 1.5;
  margin: 0;
}

.confidence-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.confidence-label {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.35);
  flex-shrink: 0;
  font-weight: 600;
}

.confidence-bar-wrap {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
}

.confidence-bar {
  flex: 1;
  height: 4px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 100px;
  overflow: hidden;
}

.confidence-fill {
  height: 100%;
  background: linear-gradient(90deg, #7c3aed, #34d399);
  border-radius: 100px;
  transition: width 1s ease;
}

.confidence-value {
  font-size: 0.75rem;
  font-weight: 700;
  color: #34d399;
  flex-shrink: 0;
}

.agent-idle {
  margin-top: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.2);
}

.idle-dots {
  display: flex;
  gap: 3px;
}

.idle-dots span {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
