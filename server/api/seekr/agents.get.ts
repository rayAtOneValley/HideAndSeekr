export default defineEventHandler(async () => {
  try {
    const data = await seekrFetch("/flow/agents/");
    return data;
  } catch {
    return {
      agents: [
        { id: "event-discovery", name: "Event Discovery Agent", description: "Finds nearby events matching user preferences" },
        { id: "budget", name: "Budget Agent", description: "Estimates total costs for events" },
        { id: "weather", name: "Weather Agent", description: "Checks outdoor conditions and weather risks" },
        { id: "schedule", name: "Schedule Agent", description: "Creates optimal event itineraries" }
      ],
      total: 4
    };
  }
});
