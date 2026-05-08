<template>
  <Teleport to="body">
    <Transition name="drawer">
      <div v-if="event" class="drawer-overlay" @click.self="$emit('close')">
        <div class="drawer">
          <div class="drawer-header">
            <div class="drawer-title-row">
              <div>
                <div class="drawer-category">{{ event.category }}</div>
                <h2 class="drawer-event-name">{{ event.eventName }}</h2>
                <p class="drawer-venue">{{ event.venue }} · {{ event.location }}</p>
              </div>
              <button class="close-btn" @click="$emit('close')">✕</button>
            </div>
            <div class="drawer-meta">
              <span class="meta-pill">📅 {{ event.date }}</span>
              <span class="meta-pill">🕐 {{ event.time }}</span>
              <span class="meta-pill">🎟️ {{ event.priceRange }}</span>
              <span class="match-pill">{{ event.matchScore }}% match</span>
            </div>
          </div>

          <div class="drawer-body">
            <p class="drawer-description">{{ event.description }}</p>

            <div class="drawer-match">
              <h4 class="section-title">Why This Matches You</h4>
              <p class="match-reason-text">{{ event.matchReason }}</p>
            </div>

            <div class="drawer-two-col">
              <div class="detail-section">
                <h4 class="section-title">💰 Budget Breakdown</h4>
                <div class="budget-items">
                  <div class="budget-row">
                    <span>Tickets</span>
                    <span>{{ event.budgetAnalysis.estimatedTicketCost }}</span>
                  </div>
                  <div class="budget-row">
                    <span>Transportation</span>
                    <span>{{ event.budgetAnalysis.estimatedTransportationCost }}</span>
                  </div>
                  <div class="budget-row">
                    <span>Food & Drinks</span>
                    <span>{{ event.budgetAnalysis.estimatedFoodAndDrinkCost }}</span>
                  </div>
                  <div class="budget-row">
                    <span>Fees</span>
                    <span>{{ event.budgetAnalysis.estimatedFees }}</span>
                  </div>
                  <div class="budget-row budget-row--total">
                    <span>Total</span>
                    <span :class="`budget-fit--${event.budgetAnalysis.budgetFit}`">{{ event.budgetAnalysis.estimatedTotalCost }}</span>
                  </div>
                </div>

                <div class="tips-list">
                  <p class="tips-title">Cost-Saving Tips</p>
                  <ul>
                    <li v-for="(tip, i) in event.budgetAnalysis.costSavingTips" :key="i">{{ tip }}</li>
                  </ul>
                </div>
              </div>

              <div class="detail-section">
                <h4 class="section-title">🌤️ Weather Analysis</h4>
                <div class="weather-grid">
                  <div class="weather-stat">
                    <span class="stat-label">Venue Type</span>
                    <span class="stat-value" :class="`venue--${event.weatherAnalysis.venueType}`">{{ event.weatherAnalysis.venueType }}</span>
                  </div>
                  <div class="weather-stat">
                    <span class="stat-label">Temperature</span>
                    <span class="stat-value">{{ event.weatherAnalysis.expectedTemperature }}</span>
                  </div>
                  <div class="weather-stat">
                    <span class="stat-label">Rain Risk</span>
                    <span class="stat-value">{{ event.weatherAnalysis.precipitationRisk }}</span>
                  </div>
                  <div class="weather-stat">
                    <span class="stat-label">Wind</span>
                    <span class="stat-value">{{ event.weatherAnalysis.windRisk }}</span>
                  </div>
                  <div class="weather-stat">
                    <span class="stat-label">Comfort</span>
                    <span class="stat-value" :class="`comfort--${event.weatherAnalysis.comfortLevel}`">{{ event.weatherAnalysis.comfortLevel }}</span>
                  </div>
                  <div class="weather-stat">
                    <span class="stat-label">Overall Risk</span>
                    <span class="stat-value" :class="`risk--${event.weatherAnalysis.weatherRisk}`">{{ event.weatherAnalysis.weatherRisk }}</span>
                  </div>
                </div>
                <div class="weather-rec">
                  <p>{{ event.weatherAnalysis.recommendation }}</p>
                </div>
              </div>
            </div>

            <div v-if="event.sourceUrl" class="source-link">
              <a :href="event.sourceUrl" target="_blank" rel="noopener" class="source-btn">
                View Event Page →
              </a>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { RecommendedEvent } from "~/types/eventFinder";

defineProps<{
  event: RecommendedEvent | null;
}>();

defineEmits<{
  close: [];
}>();
</script>

<style scoped>
.drawer-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  z-index: 100;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

@media (min-width: 768px) {
  .drawer-overlay {
    align-items: center;
    justify-content: flex-end;
  }
}

.drawer {
  background: #111118;
  border: 1px solid rgba(255, 255, 255, 0.1);
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  border-radius: 20px 20px 0 0;
}

@media (min-width: 768px) {
  .drawer {
    width: 520px;
    max-height: 100vh;
    border-radius: 20px 0 0 20px;
    height: 100vh;
  }
}

.drawer-header {
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
  position: sticky;
  top: 0;
  background: #111118;
  z-index: 1;
}

.drawer-title-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
}

.drawer-category {
  font-size: 0.6875rem;
  font-weight: 700;
  color: #7c3aed;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 0.25rem;
}

.drawer-event-name {
  font-size: 1.375rem;
  font-weight: 800;
  color: white;
  margin: 0 0 0.25rem;
  letter-spacing: -0.02em;
  line-height: 1.2;
}

.drawer-venue {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.45);
  margin: 0;
}

.close-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.drawer-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.meta-pill {
  padding: 0.25rem 0.625rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 100px;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.55);
}

.match-pill {
  padding: 0.25rem 0.625rem;
  background: rgba(52, 211, 153, 0.1);
  border: 1px solid rgba(52, 211, 153, 0.3);
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 700;
  color: #34d399;
}

.drawer-body {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.drawer-description {
  font-size: 0.9375rem;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.6;
  margin: 0;
}

.section-title {
  font-size: 0.75rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.4);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin: 0 0 0.75rem;
}

.drawer-match {
  padding: 1rem;
  background: rgba(124, 58, 237, 0.06);
  border: 1px solid rgba(124, 58, 237, 0.2);
  border-radius: 12px;
}

.match-reason-text {
  font-size: 0.9375rem;
  color: rgba(167, 139, 250, 0.8);
  line-height: 1.5;
  margin: 0;
}

.drawer-two-col {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
}

.detail-section {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  padding: 1rem;
}

.budget-items {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.budget-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.5);
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}

.budget-row:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.budget-row--total {
  font-weight: 700;
  color: rgba(255, 255, 255, 0.8);
  padding-top: 0.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  border-bottom: none;
}

.budget-fit--under_budget { color: #34d399; }
.budget-fit--near_budget { color: #fbbf24; }
.budget-fit--over_budget { color: #f87171; }

.tips-title {
  font-size: 0.6875rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.3);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 0.375rem;
}

.tips-list ul {
  margin: 0;
  padding-left: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.tips-list li {
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.45);
  line-height: 1.4;
}

.weather-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  margin-bottom: 0.875rem;
}

.weather-stat {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.stat-label {
  font-size: 0.6875rem;
  color: rgba(255, 255, 255, 0.3);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.stat-value {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 600;
  text-transform: capitalize;
}

.venue--indoor { color: #60a5fa; }
.venue--outdoor { color: #34d399; }
.venue--mixed { color: #fbbf24; }

.comfort--great { color: #34d399; }
.comfort--okay { color: #fbbf24; }
.comfort--poor { color: #f87171; }

.risk--low { color: #34d399; }
.risk--medium { color: #fbbf24; }
.risk--high { color: #f87171; }

.weather-rec {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  padding: 0.625rem;
}

.weather-rec p {
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.45);
  line-height: 1.5;
  margin: 0;
}

.source-link {
  text-align: center;
}

.source-btn {
  display: inline-block;
  padding: 0.6875rem 1.5rem;
  background: rgba(124, 58, 237, 0.12);
  border: 1px solid rgba(124, 58, 237, 0.3);
  border-radius: 10px;
  color: #a78bfa;
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
}

.source-btn:hover {
  background: rgba(124, 58, 237, 0.2);
  border-color: rgba(124, 58, 237, 0.5);
}

.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.3s ease;
}

.drawer-enter-active .drawer,
.drawer-leave-active .drawer {
  transition: transform 0.3s ease;
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}

.drawer-enter-from .drawer {
  transform: translateY(100%);
}

@media (min-width: 768px) {
  .drawer-enter-from .drawer {
    transform: translateX(100%);
  }
}
</style>
