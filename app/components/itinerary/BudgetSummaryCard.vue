<template>
  <div class="budget-card">
    <div class="card-header">
      <span class="card-icon">💰</span>
      <h3 class="card-title">Total Budget</h3>
    </div>
    <div class="total-amount">{{ itinerary.totalEstimatedCost }}</div>
    <p class="budget-note">Estimated total for the recommended event</p>

    <div v-if="topEvent" class="breakdown">
      <div class="breakdown-row">
        <span class="breakdown-label">Tickets</span>
        <span class="breakdown-value">{{ topEvent.budgetAnalysis.estimatedTicketCost }}</span>
      </div>
      <div class="breakdown-row">
        <span class="breakdown-label">Transport</span>
        <span class="breakdown-value">{{ topEvent.budgetAnalysis.estimatedTransportationCost }}</span>
      </div>
      <div class="breakdown-row">
        <span class="breakdown-label">Food & Drinks</span>
        <span class="breakdown-value">{{ topEvent.budgetAnalysis.estimatedFoodAndDrinkCost }}</span>
      </div>
      <div class="breakdown-row">
        <span class="breakdown-label">Fees</span>
        <span class="breakdown-value">{{ topEvent.budgetAnalysis.estimatedFees }}</span>
      </div>
    </div>

    <div v-if="topEvent" class="fit-badge" :class="`fit--${topEvent.budgetAnalysis.budgetFit}`">
      {{ FIT_LABELS[topEvent.budgetAnalysis.budgetFit] }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RecommendedItinerary, RecommendedEvent } from "~/types/eventFinder";

defineProps<{
  itinerary: RecommendedItinerary;
  topEvent?: RecommendedEvent;
}>();

const FIT_LABELS = {
  under_budget: "✓ Under Budget",
  near_budget: "~ Near Budget",
  over_budget: "⚠ Over Budget"
};
</script>

<style scoped>
.budget-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 16px;
  padding: 1.25rem;
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

.total-amount {
  font-size: 2rem;
  font-weight: 800;
  color: white;
  letter-spacing: -0.04em;
  margin-bottom: 0.25rem;
}

.budget-note {
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.3);
  margin: 0 0 1rem;
}

.breakdown {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.875rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  margin-bottom: 0.875rem;
}

.breakdown-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.breakdown-label {
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.4);
}

.breakdown-value {
  font-size: 0.875rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
}

.fit-badge {
  text-align: center;
  padding: 0.375rem;
  border-radius: 8px;
  font-size: 0.8125rem;
  font-weight: 700;
  border: 1px solid;
}

.fit--under_budget {
  color: #34d399;
  background: rgba(52, 211, 153, 0.08);
  border-color: rgba(52, 211, 153, 0.25);
}

.fit--near_budget {
  color: #fbbf24;
  background: rgba(251, 191, 36, 0.08);
  border-color: rgba(251, 191, 36, 0.25);
}

.fit--over_budget {
  color: #f87171;
  background: rgba(248, 113, 113, 0.08);
  border-color: rgba(248, 113, 113, 0.25);
}
</style>
