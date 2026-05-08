<template>
  <AppShell :header-status="headerStatus">
    <Transition name="page-fade" mode="out-in">
      <!-- SEARCH SCREEN -->
      <div v-if="screen === 'search'" key="search" class="screen-search">
        <EventSearchForm :is-loading="isSearching" @submit="handleSearch" />
      </div>

      <!-- AGENT PIPELINE SCREEN -->
      <div v-else-if="screen === 'agents'" key="agents" class="screen-agents">
        <div class="agents-header">
          <div class="agents-breadcrumb" @click="goBack">
            <span class="breadcrumb-arrow">←</span> Back to Search
          </div>
          <div class="agents-context">
            <span class="context-icon">🔍</span>
            <span class="context-text">{{ searchRequest?.location }} · {{ searchRequest?.date }}</span>
          </div>
        </div>

        <AgentPipeline :agents="agents" :all-complete="allComplete" />

        <Transition name="fade-up">
          <div v-if="allComplete" class="results-preview-btn">
            <button
              class="view-results-btn"
              :disabled="!result"
              @click="screen = 'results'"
            >
              <template v-if="result">
                <span>View Your Event Plan</span>
                <span class="btn-arrow">→</span>
              </template>
              <template v-else>
                <span class="btn-spinner"></span>
                <span>Finalizing your plan…</span>
              </template>
            </button>
          </div>
        </Transition>
      </div>

      <!-- RESULTS DASHBOARD -->
      <div v-else-if="screen === 'results' && result" key="results" class="screen-results">
        <div class="results-header">
          <div class="results-nav">
            <button class="back-btn" @click="screen = 'agents'">
              <span>←</span> Back to Agents
            </button>
            <button class="new-search-btn" @click="handleReset">
              <span>✦</span> New Search
            </button>
          </div>

          <div class="results-hero">
            <div class="data-source-badge" :class="result.dataSource === 'live' ? 'badge-live' : 'badge-mock'">
              <span class="badge-dot"></span>
              {{ result.dataSource === 'live' ? 'Live SeekrFlow AI' : 'Demo Data (Fallback)' }}
            </div>
            <h1 class="results-title">Your <span class="gradient-text">Event Plan</span></h1>
            <p class="results-subtitle">
              {{ result.recommendedEvents.length }} events found in {{ result.location }}
              <span class="dot-separator">·</span>
              AI-curated for your preferences
            </p>
          </div>
        </div>

        <!-- BEST MATCH FEATURED -->
        <div v-if="topEvent" class="featured-section">
          <div class="section-label">
            <span class="label-dot"></span>
            Best Match
          </div>
          <div class="featured-event-layout">
            <div class="featured-event-main">
              <EventRecommendationCard
                :event="topEvent"
                :is-featured="true"
                @select="openDrawer"
              />
            </div>
            <div class="featured-event-sidebar">
              <BudgetSummaryCard :itinerary="result.recommendedItinerary" :top-event="topEvent" />
              <WeatherSummaryCard :itinerary="result.recommendedItinerary" :top-event="topEvent" />
            </div>
          </div>
        </div>

        <!-- ITINERARY -->
        <div class="itinerary-section">
          <div class="section-label">
            <span class="label-dot"></span>
            Recommended Itinerary
          </div>
          <div class="itinerary-card">
            <ItineraryTimeline :itinerary="result.recommendedItinerary" />
          </div>
        </div>

        <!-- OTHER EVENTS -->
        <div v-if="otherEvents.length" class="other-events-section">
          <div class="section-label">
            <span class="label-dot"></span>
            More Events
          </div>
          <div class="events-grid">
            <EventRecommendationCard
              v-for="event in otherEvents"
              :key="event.eventName"
              :event="event"
              @select="openDrawer"
            />
          </div>
        </div>

        <!-- AGENT REASONING PANEL -->
        <div class="reasoning-section">
          <div class="section-label">
            <span class="label-dot"></span>
            Agent Reasoning
          </div>
          <div class="reasoning-grid">
            <div v-for="agent in agents" :key="agent.id" class="reasoning-card">
              <div class="reasoning-header">
                <span class="reasoning-icon">{{ agent.icon }}</span>
                <div>
                  <h4 class="reasoning-name">{{ agent.name }}</h4>
                  <div class="reasoning-conf" v-if="agent.confidenceScore">
                    {{ agent.confidenceScore }}% confidence
                  </div>
                </div>
              </div>
              <p class="reasoning-text">{{ agent.reasoning }}</p>
              <div class="reasoning-tasks">
                <span v-for="task in agent.completedTasks" :key="task.id" class="task-chip">
                  ✓ {{ task.description }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- EVENT DETAIL DRAWER -->
    <EventDetailDrawer
      :event="selectedEvent"
      @close="selectedEvent = null"
    />
  </AppShell>
</template>

<script setup lang="ts">
import type { EventSearchRequest, EventFinderOutput, RecommendedEvent } from "~/types/eventFinder";

type Screen = "search" | "agents" | "results";

const screen = ref<Screen>("search");
const searchRequest = ref<EventSearchRequest | null>(null);
const result = ref<EventFinderOutput | null>(null);
const selectedEvent = ref<RecommendedEvent | null>(null);
const isSearching = ref(false);

const { findEvents } = useEventFinder();
const { agents, allComplete, simulatePipeline } = useSeekrAgents();

const headerStatus = computed(() => {
  if (screen.value === "agents") return "searching";
  if (screen.value === "results") return "ready";
  return "idle";
});

const topEvent = computed(() => result.value?.recommendedEvents[0] ?? null);
const otherEvents = computed(() => result.value?.recommendedEvents.slice(1) ?? []);

async function handleSearch(request: EventSearchRequest) {
  searchRequest.value = request;
  isSearching.value = true;
  screen.value = "agents";

  await simulatePipeline(
    (r) => {
      result.value = r;
    },
    () => findEvents(request)
  );

  isSearching.value = false;
}

function goBack() {
  if (screen.value === "agents") {
    screen.value = "search";
  }
}

function handleReset() {
  screen.value = "search";
  result.value = null;
  searchRequest.value = null;
  selectedEvent.value = null;
}

function openDrawer(event: RecommendedEvent) {
  selectedEvent.value = event;
}
</script>

<style scoped>
.screen-search {
  padding: 3rem 0 2rem;
}

.screen-agents {
  max-width: 960px;
  margin: 0 auto;
  padding: 1.5rem 0;
}

.agents-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.agents-breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.35);
  cursor: pointer;
  transition: color 0.2s ease;
}

.agents-breadcrumb:hover {
  color: rgba(255, 255, 255, 0.7);
}

.breadcrumb-arrow {
  font-size: 1rem;
}

.agents-context {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.875rem;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 100px;
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.45);
}

.context-icon {
  font-size: 0.875rem;
}

.results-preview-btn {
  margin-top: 2rem;
  text-align: center;
}

.view-results-btn {
  padding: 0.875rem 2.5rem;
  background: linear-gradient(135deg, #7c3aed, #4f46e5);
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
  transition: all 0.2s ease;
  font-family: inherit;
}

.view-results-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(124, 58, 237, 0.45);
}

.view-results-btn:disabled {
  cursor: progress;
  opacity: 0.7;
  background: linear-gradient(135deg, rgba(124, 58, 237, 0.5), rgba(79, 70, 229, 0.5));
}

.btn-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: btn-spin 0.8s linear infinite;
}

@keyframes btn-spin {
  to { transform: rotate(360deg); }
}

.btn-arrow {
  transition: transform 0.2s ease;
}

.view-results-btn:hover .btn-arrow {
  transform: translateX(3px);
}

.screen-results {
  max-width: 1100px;
  margin: 0 auto;
}

.results-header {
  margin-bottom: 2.5rem;
}

.results-nav {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
}

.back-btn, .new-search-btn {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.875rem;
  border-radius: 8px;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
}

.back-btn {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.4);
}

.back-btn:hover {
  color: rgba(255, 255, 255, 0.7);
  border-color: rgba(255, 255, 255, 0.15);
}

.new-search-btn {
  background: rgba(124, 58, 237, 0.1);
  border: 1px solid rgba(124, 58, 237, 0.3);
  color: #a78bfa;
}

.new-search-btn:hover {
  background: rgba(124, 58, 237, 0.18);
}

.results-hero {
  text-align: center;
}

.data-source-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.875rem;
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  margin-bottom: 1rem;
}

.badge-live {
  background: rgba(52, 211, 153, 0.1);
  border: 1px solid rgba(52, 211, 153, 0.3);
  color: #34d399;
}

.badge-mock {
  background: rgba(251, 191, 36, 0.1);
  border: 1px solid rgba(251, 191, 36, 0.3);
  color: #fbbf24;
}

.badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  box-shadow: 0 0 8px currentColor;
  animation: badge-pulse 2s ease-in-out infinite;
}

@keyframes badge-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.results-title {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
  color: white;
  letter-spacing: -0.03em;
  margin: 0 0 0.5rem;
}

.gradient-text {
  background: linear-gradient(135deg, #a78bfa, #60a5fa, #f472b6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.results-subtitle {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.4);
  margin: 0;
}

.dot-separator {
  margin: 0 0.5rem;
  opacity: 0.4;
}

.section-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.6875rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.3);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 1rem;
}

.label-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #7c3aed;
}

.featured-section {
  margin-bottom: 2.5rem;
}

.featured-event-layout {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 1.25rem;
  align-items: start;
}

@media (max-width: 900px) {
  .featured-event-layout {
    grid-template-columns: 1fr;
  }
}

.featured-event-sidebar {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.itinerary-section {
  margin-bottom: 2.5rem;
}

.itinerary-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 20px;
  padding: 1.75rem;
}

.other-events-section {
  margin-bottom: 2.5rem;
}

.events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.25rem;
}

@media (max-width: 640px) {
  .events-grid {
    grid-template-columns: 1fr;
  }
}

.reasoning-section {
  margin-bottom: 2rem;
}

.reasoning-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1rem;
}

.reasoning-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 14px;
  padding: 1rem;
}

.reasoning-header {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  margin-bottom: 0.625rem;
}

.reasoning-icon {
  font-size: 1.125rem;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  flex-shrink: 0;
}

.reasoning-name {
  font-size: 0.875rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.8);
  margin: 0 0 0.125rem;
}

.reasoning-conf {
  font-size: 0.6875rem;
  color: #34d399;
  font-weight: 600;
}

.reasoning-text {
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.4);
  line-height: 1.5;
  margin: 0 0 0.75rem;
}

.reasoning-tasks {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.task-chip {
  font-size: 0.6875rem;
  color: rgba(52, 211, 153, 0.6);
  font-weight: 500;
}

/* Transitions */
.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.page-fade-enter-from {
  opacity: 0;
  transform: translateY(16px);
}

.page-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.fade-up-enter-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.fade-up-enter-from {
  opacity: 0;
  transform: translateY(16px);
}
</style>
