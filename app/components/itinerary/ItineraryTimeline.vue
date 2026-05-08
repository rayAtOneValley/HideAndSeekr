<template>
  <div class="timeline-wrapper">
    <div class="timeline-header">
      <h3 class="timeline-title">{{ itinerary.title }}</h3>
      <p class="timeline-summary">{{ itinerary.summary }}</p>
    </div>

    <div class="timeline-items">
      <div
        v-for="(item, index) in itinerary.timeline"
        :key="index"
        class="timeline-item"
        :class="{ 'timeline-item--first': index === 0, 'timeline-item--last': index === itinerary.timeline.length - 1 }"
      >
        <div class="timeline-left">
          <div class="time-label">{{ item.time }}</div>
          <div class="timeline-track">
            <div class="timeline-dot" :class="getDotClass(index)"></div>
            <div v-if="index < itinerary.timeline.length - 1" class="timeline-line"></div>
          </div>
        </div>
        <div class="timeline-content">
          <h4 class="activity-name">{{ item.activity }}</h4>
          <p class="activity-location">📍 {{ item.location }}</p>
          <p v-if="item.notes" class="activity-notes">{{ item.notes }}</p>
        </div>
      </div>
    </div>

    <div class="timeline-backup">
      <div class="backup-header">
        <span class="backup-icon">🔄</span>
        <span class="backup-title">Backup Plan</span>
      </div>
      <p class="backup-text">{{ itinerary.backupPlan }}</p>
    </div>

    <div class="why-works">
      <h4 class="why-title">Why This Plan Works</h4>
      <ul class="why-list">
        <li v-for="(reason, i) in itinerary.whyThisPlanWorks" :key="i" class="why-item">
          <span class="why-check">✦</span>
          {{ reason }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RecommendedItinerary } from "~/types/eventFinder";

defineProps<{
  itinerary: RecommendedItinerary;
}>();

function getDotClass(index: number) {
  if (index === 0) return "dot--start";
  if (index % 3 === 0) return "dot--event";
  return "dot--default";
}
</script>

<style scoped>
.timeline-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.timeline-header {
  margin-bottom: 0.25rem;
}

.timeline-title {
  font-size: 1.125rem;
  font-weight: 800;
  color: white;
  margin: 0 0 0.375rem;
  letter-spacing: -0.02em;
}

.timeline-summary {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.45);
  margin: 0;
  line-height: 1.5;
}

.timeline-items {
  display: flex;
  flex-direction: column;
}

.timeline-item {
  display: flex;
  gap: 1rem;
}

.timeline-left {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  width: 64px;
}

.time-label {
  font-size: 0.6875rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.35);
  text-align: center;
  line-height: 1.2;
  padding-top: 0.125rem;
  white-space: nowrap;
}

.timeline-track {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  padding-top: 0.25rem;
}

.timeline-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
  border: 2px solid;
}

.dot--start {
  background: #7c3aed;
  border-color: #7c3aed;
  box-shadow: 0 0 12px rgba(124, 58, 237, 0.5);
  width: 12px;
  height: 12px;
}

.dot--event {
  background: #f472b6;
  border-color: #f472b6;
  box-shadow: 0 0 10px rgba(244, 114, 182, 0.4);
}

.dot--default {
  background: transparent;
  border-color: rgba(255, 255, 255, 0.2);
}

.timeline-line {
  width: 1px;
  flex: 1;
  min-height: 24px;
  background: linear-gradient(to bottom, rgba(255,255,255,0.12), rgba(255,255,255,0.04));
  margin: 4px 0;
}

.timeline-content {
  padding-bottom: 1.25rem;
  flex: 1;
  min-width: 0;
}

.activity-name {
  font-size: 0.9375rem;
  font-weight: 700;
  color: white;
  margin: 0 0 0.2rem;
  line-height: 1.3;
}

.activity-location {
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.4);
  margin: 0 0 0.375rem;
}

.activity-notes {
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.35);
  line-height: 1.5;
  margin: 0;
  padding: 0.5rem 0.75rem;
  background: rgba(255, 255, 255, 0.03);
  border-left: 2px solid rgba(124, 58, 237, 0.3);
  border-radius: 0 6px 6px 0;
}

.timeline-backup {
  background: rgba(251, 191, 36, 0.05);
  border: 1px solid rgba(251, 191, 36, 0.2);
  border-radius: 12px;
  padding: 1rem;
}

.backup-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.backup-icon {
  font-size: 0.875rem;
}

.backup-title {
  font-size: 0.75rem;
  font-weight: 700;
  color: #fbbf24;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.backup-text {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.55;
  margin: 0;
}

.why-works {
  background: rgba(52, 211, 153, 0.04);
  border: 1px solid rgba(52, 211, 153, 0.15);
  border-radius: 12px;
  padding: 1rem;
}

.why-title {
  font-size: 0.75rem;
  font-weight: 700;
  color: rgba(52, 211, 153, 0.7);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 0.75rem;
}

.why-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.why-item {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.55);
  line-height: 1.45;
}

.why-check {
  color: #34d399;
  flex-shrink: 0;
  font-size: 0.6875rem;
  margin-top: 3px;
}
</style>
