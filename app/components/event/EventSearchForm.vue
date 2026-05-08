<template>
  <div class="search-form-wrapper">
    <div class="form-hero">
      <h1 class="hero-title">
        Find Your <span class="gradient-text">Perfect Night</span>
      </h1>
      <p class="hero-sub">
        AI agents discover events, estimate costs, check weather, and build your itinerary — in seconds.
      </p>
    </div>

    <form class="search-form" @submit.prevent="handleSubmit">
      <div class="form-grid">
        <div class="form-group form-group--location">
          <label class="form-label">
            <span class="label-icon">📍</span> Location
          </label>
          <input
            v-model="form.location"
            type="text"
            class="form-input"
            placeholder="San Jose, CA"
            required
          />
        </div>

        <div class="form-group form-group--date">
          <label class="form-label">
            <span class="label-icon">📅</span> Date
          </label>
          <input
            v-model="form.date"
            type="date"
            class="form-input"
            required
          />
        </div>

        <div class="form-group form-group--type">
          <label class="form-label">
            <span class="label-icon">🎪</span> Event Type
          </label>
          <select v-model="form.eventType" class="form-input form-select">
            <option value="">Any Event</option>
            <option value="concerts">Concerts & Live Music</option>
            <option value="nightlife">Nightlife & Clubs</option>
            <option value="festivals">Festivals</option>
            <option value="sports">Sports & Racing</option>
            <option value="comedy">Comedy Shows</option>
            <option value="arts">Arts & Theater</option>
            <option value="food">Food & Drink Events</option>
          </select>
        </div>

        <div class="form-group form-group--budget">
          <label class="form-label">
            <span class="label-icon">💰</span> Total Budget
          </label>
          <select v-model="form.budget" class="form-input form-select">
            <option value="under $50">Under $50</option>
            <option value="under $100">Under $100</option>
            <option value="under $150" selected>Under $150</option>
            <option value="under $200">Under $200</option>
            <option value="under $300">Under $300</option>
            <option value="no limit">No Limit</option>
          </select>
        </div>

        <div class="form-group form-group--transport">
          <label class="form-label">
            <span class="label-icon">🚗</span> Getting There
          </label>
          <select v-model="form.transportationPreference" class="form-input form-select">
            <option value="uber/lyft">Uber / Lyft</option>
            <option value="driving">Driving</option>
            <option value="public transit">Public Transit</option>
            <option value="walking">Walking</option>
          </select>
        </div>

        <div class="form-group form-group--venue">
          <label class="form-label">
            <span class="label-icon">🏟️</span> Venue Preference
          </label>
          <select v-model="form.indoorOutdoorPreference" class="form-input form-select">
            <option value="no preference">No Preference</option>
            <option value="indoor">Indoor Only</option>
            <option value="outdoor">Outdoor</option>
          </select>
        </div>

        <div class="form-group form-group--interests">
          <label class="form-label">
            <span class="label-icon">✨</span> Interests
          </label>
          <div class="interest-chips">
            <button
              v-for="interest in INTERESTS"
              :key="interest"
              type="button"
              class="chip"
              :class="{ 'chip--active': form.interests.includes(interest) }"
              @click="toggleInterest(interest)"
            >
              {{ interest }}
            </button>
          </div>
        </div>
      </div>

      <div class="form-footer">
        <button type="submit" class="submit-btn" :disabled="isLoading">
          <span v-if="!isLoading" class="btn-content">
            <span class="btn-icon">✦</span>
            Find Events with AI
          </span>
          <span v-else class="btn-loading">
            <span class="loading-spinner"></span>
            Running Agents...
          </span>
        </button>
        <p class="form-hint">4 AI agents will analyze events, budget, weather & schedule</p>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { EventSearchRequest } from "~/types/eventFinder";

const props = defineProps<{
  isLoading?: boolean;
}>();

const emit = defineEmits<{
  submit: [request: EventSearchRequest];
}>();

const INTERESTS = ["EDM", "Hip-Hop", "Indie Rock", "Jazz", "Pop", "R&B", "Sports", "Comedy", "Craft Beer", "Wine", "Food", "Dancing"];

const today = new Date();
const nextSaturday = new Date(today);
nextSaturday.setDate(today.getDate() + ((6 - today.getDay() + 7) % 7 || 7));
const defaultDate = nextSaturday.toISOString().split("T")[0] ?? "";

const form = reactive<EventSearchRequest>({
  location: "San Jose, CA",
  date: defaultDate,
  eventType: "",
  interests: [],
  budget: "under $300",
  transportationPreference: "driving",
  indoorOutdoorPreference: "no preference"
});

function toggleInterest(interest: string) {
  const idx = form.interests.indexOf(interest);
  if (idx > -1) {
    form.interests.splice(idx, 1);
  } else {
    form.interests.push(interest);
  }
}

function handleSubmit() {
  emit("submit", { ...form });
}
</script>

<style scoped>
.search-form-wrapper {
  max-width: 780px;
  margin: 0 auto;
}

.form-hero {
  text-align: center;
  margin-bottom: 2.5rem;
}

.hero-title {
  font-size: clamp(2rem, 5vw, 3.25rem);
  font-weight: 800;
  color: white;
  letter-spacing: -0.03em;
  line-height: 1.1;
  margin-bottom: 0.875rem;
}

.gradient-text {
  background: linear-gradient(135deg, #a78bfa, #60a5fa, #f472b6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-sub {
  font-size: 1.0625rem;
  color: rgba(255, 255, 255, 0.45);
  max-width: 480px;
  margin: 0 auto;
  line-height: 1.6;
}

.search-form {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 20px;
  padding: 2rem;
  backdrop-filter: blur(12px);
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
}

@media (max-width: 600px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  .search-form {
    padding: 1.25rem;
  }
}

.form-group--interests {
  grid-column: 1 / -1;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 0.5rem;
}

.label-icon {
  font-size: 0.875rem;
}

.form-input {
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 0.75rem 1rem;
  color: white;
  font-size: 0.9375rem;
  font-family: inherit;
  transition: all 0.2s ease;
  outline: none;
}

.form-input:focus {
  border-color: rgba(124, 58, 237, 0.6);
  background: rgba(124, 58, 237, 0.06);
  box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.12);
}

.form-input::placeholder {
  color: rgba(255, 255, 255, 0.25);
}

.form-select {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='rgba(255,255,255,0.3)' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 2rem;
}

.form-select option {
  background: #1a1a2e;
  color: white;
}

input[type="date"]::-webkit-calendar-picker-indicator {
  filter: invert(0.5);
  cursor: pointer;
}

.interest-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.chip {
  padding: 0.375rem 0.875rem;
  border-radius: 100px;
  font-size: 0.8125rem;
  font-weight: 500;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.04);
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.2s ease;
}

.chip:hover {
  border-color: rgba(167, 139, 250, 0.4);
  color: rgba(167, 139, 250, 0.8);
  background: rgba(124, 58, 237, 0.08);
}

.chip--active {
  border-color: rgba(124, 58, 237, 0.6);
  background: rgba(124, 58, 237, 0.15);
  color: #a78bfa;
}

.form-footer {
  margin-top: 1.75rem;
  text-align: center;
}

.submit-btn {
  width: 100%;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #7c3aed, #4f46e5);
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  font-family: inherit;
  letter-spacing: -0.01em;
}

.submit-btn::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.submit-btn:hover:not(:disabled)::before {
  opacity: 1;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 8px 32px rgba(124, 58, 237, 0.45);
}

.submit-btn:active:not(:disabled) {
  transform: translateY(0);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.625rem;
}

.btn-icon {
  font-size: 1rem;
}

.btn-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.625rem;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.form-hint {
  margin-top: 0.75rem;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.25);
}
</style>
