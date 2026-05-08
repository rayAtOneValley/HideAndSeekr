<template>
  <div class="event-card" :class="{ 'event-card--featured': isFeatured }" @click="$emit('select', event)">
    <div v-if="isFeatured" class="featured-badge">
      <span>✦</span> Best Match
    </div>

    <div class="card-header">
      <div class="event-category">
        <span class="category-icon">{{ categoryIcon }}</span>
        {{ event.category }}
      </div>
      <div class="match-score" :class="scoreClass">
        {{ event.matchScore }}%
      </div>
    </div>

    <h3 class="event-name">{{ event.eventName }}</h3>
    <p class="event-venue">{{ event.venue }}</p>

    <div class="event-meta">
      <div class="meta-item">
        <span class="meta-icon">📅</span>
        <span>{{ event.date }}</span>
      </div>
      <div class="meta-item">
        <span class="meta-icon">🕐</span>
        <span>{{ event.time }}</span>
      </div>
    </div>

    <p class="event-description">{{ event.description }}</p>

    <div class="event-badges">
      <div class="badge badge--budget" :class="`badge--${event.budgetAnalysis.budgetFit}`">
        <span class="badge-icon">💰</span>
        {{ event.budgetAnalysis.estimatedTotalCost }}
        <span class="badge-sub">{{ BUDGET_FIT_LABELS[event.budgetAnalysis.budgetFit] }}</span>
      </div>
      <div class="badge badge--weather" :class="`badge--weather-${event.weatherAnalysis.weatherRisk}`">
        <span class="badge-icon">{{ weatherIcon }}</span>
        {{ event.weatherAnalysis.venueType }}
        <span class="badge-sub">{{ WEATHER_RISK_LABELS[event.weatherAnalysis.weatherRisk] }}</span>
      </div>
      <div class="badge badge--comfort" :class="`badge--comfort-${event.weatherAnalysis.comfortLevel}`">
        {{ COMFORT_LABELS[event.weatherAnalysis.comfortLevel] }}
      </div>
    </div>

    <div class="match-reason">
      <span class="reason-icon">✦</span>
      {{ event.matchReason }}
    </div>

    <button class="view-btn">
      View Details & Itinerary
      <span class="view-arrow">→</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import type { RecommendedEvent } from "~/types/eventFinder";

const props = defineProps<{
  event: RecommendedEvent;
  isFeatured?: boolean;
}>();

defineEmits<{
  select: [event: RecommendedEvent];
}>();

const CATEGORY_ICONS: Record<string, string> = {
  "Live Music": "🎸",
  "Nightlife": "🌙",
  "Festival": "🎪",
  "Sports": "⚡",
  "Comedy": "😂",
  "Jazz": "🎷",
  "Electronic": "🎛️",
  "Pop": "🎤",
  "EDM": "🎵",
  "Rock": "🎸"
};

const BUDGET_FIT_LABELS = {
  under_budget: "Under Budget",
  near_budget: "Near Budget",
  over_budget: "Over Budget"
};

const WEATHER_RISK_LABELS = {
  low: "Low Risk",
  medium: "Medium Risk",
  high: "High Risk"
};

const COMFORT_LABELS = {
  great: "Great Conditions",
  okay: "Okay Conditions",
  poor: "Poor Conditions",
  unknown: "Conditions Unknown"
};

const categoryIcon = computed(() => {
  const cat = props.event.category;
  for (const [key, icon] of Object.entries(CATEGORY_ICONS)) {
    if (cat.toLowerCase().includes(key.toLowerCase())) return icon;
  }
  return "🎭";
});

const weatherIcon = computed(() => {
  const type = props.event.weatherAnalysis.venueType;
  if (type === "indoor") return "🏛️";
  if (type === "outdoor") return "🌤️";
  if (type === "mixed") return "⛅";
  return "🏟️";
});

const scoreClass = computed(() => {
  const score = props.event.matchScore;
  if (score >= 90) return "score--excellent";
  if (score >= 75) return "score--good";
  return "score--fair";
});
</script>

<style scoped>
.event-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.25s ease;
  position: relative;
  overflow: hidden;
}

.event-card::before {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 30% 20%, rgba(124, 58, 237, 0.06), transparent 60%);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.event-card:hover::before {
  opacity: 1;
}

.event-card:hover {
  border-color: rgba(124, 58, 237, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3), 0 0 40px rgba(124, 58, 237, 0.08);
}

.event-card--featured {
  border-color: rgba(124, 58, 237, 0.4);
  background: rgba(124, 58, 237, 0.05);
  box-shadow: 0 0 50px rgba(124, 58, 237, 0.12);
}

.featured-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.625rem;
  background: linear-gradient(135deg, #7c3aed, #4f46e5);
  border-radius: 100px;
  font-size: 0.6875rem;
  font-weight: 700;
  color: white;
  letter-spacing: 0.03em;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.875rem;
}

.event-category {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.4);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.category-icon {
  font-size: 0.875rem;
}

.match-score {
  font-size: 1.25rem;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.score--excellent {
  color: #34d399;
}

.score--good {
  color: #60a5fa;
}

.score--fair {
  color: #fbbf24;
}

.event-name {
  font-size: 1.1875rem;
  font-weight: 800;
  color: white;
  margin: 0 0 0.25rem;
  letter-spacing: -0.02em;
  line-height: 1.25;
  padding-right: 4rem;
}

.event-venue {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.5);
  margin: 0 0 0.875rem;
}

.event-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.875rem;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.55);
}

.meta-icon {
  font-size: 0.875rem;
}

.event-description {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.45);
  line-height: 1.55;
  margin: 0 0 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.event-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.badge {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.3125rem 0.625rem;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 600;
  border: 1px solid;
}

.badge-icon {
  font-size: 0.875rem;
}

.badge-sub {
  font-weight: 500;
  opacity: 0.7;
  font-size: 0.6875rem;
}

.badge--under_budget {
  color: #34d399;
  background: rgba(52, 211, 153, 0.08);
  border-color: rgba(52, 211, 153, 0.25);
}

.badge--near_budget {
  color: #fbbf24;
  background: rgba(251, 191, 36, 0.08);
  border-color: rgba(251, 191, 36, 0.25);
}

.badge--over_budget {
  color: #f87171;
  background: rgba(248, 113, 113, 0.08);
  border-color: rgba(248, 113, 113, 0.25);
}

.badge--weather-low {
  color: #34d399;
  background: rgba(52, 211, 153, 0.08);
  border-color: rgba(52, 211, 153, 0.25);
}

.badge--weather-medium {
  color: #fbbf24;
  background: rgba(251, 191, 36, 0.08);
  border-color: rgba(251, 191, 36, 0.25);
}

.badge--weather-high {
  color: #f87171;
  background: rgba(248, 113, 113, 0.08);
  border-color: rgba(248, 113, 113, 0.25);
}

.badge--comfort-great {
  color: #a78bfa;
  background: rgba(124, 58, 237, 0.08);
  border-color: rgba(124, 58, 237, 0.25);
}

.badge--comfort-okay {
  color: rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.1);
}

.badge--comfort-poor {
  color: #f87171;
  background: rgba(248, 113, 113, 0.08);
  border-color: rgba(248, 113, 113, 0.25);
}

.badge--comfort-unknown {
  color: rgba(255, 255, 255, 0.35);
  background: rgba(255, 255, 255, 0.03);
  border-color: rgba(255, 255, 255, 0.08);
}

.match-reason {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  font-size: 0.8125rem;
  color: rgba(167, 139, 250, 0.7);
  margin-bottom: 1rem;
  line-height: 1.4;
}

.reason-icon {
  color: #7c3aed;
  flex-shrink: 0;
  margin-top: 1px;
}

.view-btn {
  width: 100%;
  padding: 0.6875rem 1rem;
  background: rgba(124, 58, 237, 0.1);
  border: 1px solid rgba(124, 58, 237, 0.25);
  border-radius: 10px;
  color: #a78bfa;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  font-family: inherit;
}

.view-btn:hover {
  background: rgba(124, 58, 237, 0.18);
  border-color: rgba(124, 58, 237, 0.5);
}

.view-arrow {
  transition: transform 0.2s ease;
}

.view-btn:hover .view-arrow {
  transform: translateX(3px);
}
</style>
