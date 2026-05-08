<template>
  <div class="weather-card" :class="`weather-card--${riskLevel}`">
    <div class="card-header">
      <span class="card-icon">{{ weatherEmoji }}</span>
      <h3 class="card-title">Weather</h3>
    </div>

    <div class="weather-summary-text">{{ itinerary.weatherSummary }}</div>

    <div v-if="topEvent" class="weather-details">
      <div class="detail-item">
        <span class="detail-icon">🌡️</span>
        <span>{{ topEvent.weatherAnalysis.expectedTemperature }}</span>
      </div>
      <div class="detail-item">
        <span class="detail-icon">🌧️</span>
        <span>{{ topEvent.weatherAnalysis.precipitationRisk }}</span>
      </div>
      <div class="detail-item">
        <span class="detail-icon">💨</span>
        <span>{{ topEvent.weatherAnalysis.windRisk }}</span>
      </div>
    </div>

    <div class="risk-indicator" :class="`risk--${riskLevel}`">
      <span class="risk-dot"></span>
      {{ RISK_LABELS[riskLevel] }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RecommendedItinerary, RecommendedEvent } from "~/types/eventFinder";

const props = defineProps<{
  itinerary: RecommendedItinerary;
  topEvent?: RecommendedEvent;
}>();

const RISK_LABELS = {
  low: "Low Weather Risk",
  medium: "Moderate Weather Risk",
  high: "High Weather Risk"
};

const riskLevel = computed(() => props.topEvent?.weatherAnalysis.weatherRisk ?? "low");

const weatherEmoji = computed(() => {
  const risk = riskLevel.value;
  if (risk === "low") return "🌤️";
  if (risk === "medium") return "⛅";
  return "🌧️";
});
</script>

<style scoped>
.weather-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 16px;
  padding: 1.25rem;
}

.weather-card--low {
  border-color: rgba(52, 211, 153, 0.2);
  background: rgba(52, 211, 153, 0.02);
}

.weather-card--medium {
  border-color: rgba(251, 191, 36, 0.2);
  background: rgba(251, 191, 36, 0.02);
}

.weather-card--high {
  border-color: rgba(248, 113, 113, 0.2);
  background: rgba(248, 113, 113, 0.02);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.875rem;
}

.card-icon {
  font-size: 1.125rem;
}

.card-title {
  font-size: 0.75rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.4);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin: 0;
}

.weather-summary-text {
  font-size: 0.9375rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.5;
  margin-bottom: 1rem;
}

.weather-details {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  margin-bottom: 0.875rem;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.5);
}

.detail-icon {
  font-size: 0.875rem;
  width: 18px;
  text-align: center;
}

.risk-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.75rem;
  border-radius: 8px;
  font-size: 0.8125rem;
  font-weight: 700;
  border: 1px solid;
}

.risk-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.risk--low {
  color: #34d399;
  background: rgba(52, 211, 153, 0.08);
  border-color: rgba(52, 211, 153, 0.25);
}
.risk--low .risk-dot { background: #34d399; }

.risk--medium {
  color: #fbbf24;
  background: rgba(251, 191, 36, 0.08);
  border-color: rgba(251, 191, 36, 0.25);
}
.risk--medium .risk-dot { background: #fbbf24; }

.risk--high {
  color: #f87171;
  background: rgba(248, 113, 113, 0.08);
  border-color: rgba(248, 113, 113, 0.25);
}
.risk--high .risk-dot { background: #f87171; }
</style>
