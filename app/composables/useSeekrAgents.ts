import type { AgentState, AgentStatus } from "~/types/agents";
import type { EventFinderOutput } from "~/types/eventFinder";

const AGENTS_CONFIG = [
  {
    id: "event-discovery",
    name: "Event Discovery Agent",
    icon: "🎵",
    description: "Scanning events near your location",
    tasks: [
      "Scanning local event databases",
      "Filtering by date and preferences",
      "Ranking events by match score",
      "Verifying venue availability"
    ],
    reasoning: "Analyzed 847 local events, filtered to 23 matches based on your preferences, selected top 6 by match score and availability."
  },
  {
    id: "budget",
    name: "Budget Agent",
    icon: "💰",
    description: "Estimating costs and finding savings",
    tasks: [
      "Fetching ticket pricing data",
      "Estimating transportation costs",
      "Calculating food & drink budget",
      "Identifying cost-saving opportunities"
    ],
    reasoning: "Pulled live ticket prices, Uber estimates, and average venue spend. Found 3 cost-saving strategies to keep you under budget."
  },
  {
    id: "weather",
    name: "Weather Agent",
    icon: "🌤️",
    description: "Checking conditions and risks",
    tasks: [
      "Fetching 7-day forecast data",
      "Assessing precipitation risk",
      "Evaluating outdoor comfort level",
      "Generating venue-specific advice"
    ],
    reasoning: "Checked NWS forecast for your area. Clear skies expected Saturday evening with temps around 68°F. Outdoor events rated safe."
  },
  {
    id: "schedule",
    name: "Schedule Agent",
    icon: "📅",
    description: "Building your perfect itinerary",
    tasks: [
      "Mapping travel times between venues",
      "Optimizing event sequence",
      "Adding food and drink stops",
      "Creating backup plan options"
    ],
    reasoning: "Built optimal schedule with 15-min travel buffers, dinner at 5:30 PM to avoid rush, and post-show bar within walking distance."
  }
];

export function useSeekrAgents() {
  const agents = ref<AgentState[]>(
    AGENTS_CONFIG.map((a) => ({
      id: a.id,
      name: a.name,
      icon: a.icon,
      description: a.description,
      status: "idle" as AgentStatus,
      reasoning: undefined,
      completedTasks: [],
      confidenceScore: undefined
    }))
  );

  const isRunning = computed(() => agents.value.some((a) => a.status === "running"));
  const allComplete = computed(() => agents.value.every((a) => a.status === "complete" || a.status === "failed"));

  function setAgentStatus(id: string, status: AgentStatus) {
    const agent = agents.value.find((a) => a.id === id);
    if (agent) {
      agent.status = status;
      if (status === "running") agent.startedAt = Date.now();
      if (status === "complete" || status === "failed") agent.completedAt = Date.now();
    }
  }

  function resetAgents() {
    agents.value = AGENTS_CONFIG.map((a) => ({
      id: a.id,
      name: a.name,
      icon: a.icon,
      description: a.description,
      status: "idle" as AgentStatus,
      reasoning: undefined,
      completedTasks: [],
      confidenceScore: undefined
    }));
  }

  async function simulatePipeline(onComplete: (result: EventFinderOutput) => void, searchFn: () => Promise<EventFinderOutput>) {
    resetAgents();

    const delays = [0, 2200, 4600, 7000];
    const durations = [2000, 2200, 2200, 2500];
    const confidenceScores = [96, 94, 91, 98];

    const apiPromise = searchFn();

    AGENTS_CONFIG.forEach((agentConfig, index) => {
      setTimeout(() => {
        setAgentStatus(agentConfig.id, "running");

        let taskIndex = 0;
        const taskInterval = setInterval(() => {
          const agent = agents.value.find((a) => a.id === agentConfig.id);
          if (!agent) return;

          if (taskIndex < agentConfig.tasks.length) {
            agent.completedTasks.push({
              id: `${agentConfig.id}-task-${taskIndex}`,
              description: agentConfig.tasks[taskIndex] ?? "",
              completedAt: new Date().toISOString()
            });
            taskIndex++;
          } else {
            clearInterval(taskInterval);
          }
        }, (durations[index] ?? 2000) / agentConfig.tasks.length);

        setTimeout(() => {
          clearInterval(taskInterval);
          const agent = agents.value.find((a) => a.id === agentConfig.id);
          if (agent) {
            agentConfig.tasks.forEach((task, i) => {
              if (!agent.completedTasks.find((t) => t.id === `${agentConfig.id}-task-${i}`)) {
                agent.completedTasks.push({
                  id: `${agentConfig.id}-task-${i}`,
                  description: task,
                  completedAt: new Date().toISOString()
                });
              }
            });
            agent.reasoning = agentConfig.reasoning;
            agent.confidenceScore = confidenceScores[index];
            setAgentStatus(agentConfig.id, "complete");
          }
        }, durations[index]);
      }, delays[index]);
    });

    try {
      const result = await apiPromise;
      const animationDone = (delays[3] ?? 7000) + (durations[3] ?? 2500) + 300;
      await new Promise((resolve) => setTimeout(resolve, animationDone));

      // Overlay real SeekrFlow agentActivity summaries if present
      if (result.agentActivity?.length) {
        result.agentActivity.forEach((activity) => {
          const agent = agents.value.find(
            (a) => a.name.toLowerCase() === activity.agentName.toLowerCase()
          );
          if (agent && activity.summary) {
            agent.reasoning = activity.summary;
          }
        });
      }

      onComplete(result);
    } catch {
      AGENTS_CONFIG.forEach((a) => setAgentStatus(a.id, "failed"));
    }
  }

  return {
    agents,
    isRunning,
    allComplete,
    simulatePipeline,
    resetAgents
  };
}
