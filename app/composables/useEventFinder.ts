import type { EventSearchRequest, EventFinderOutput } from "~/types/eventFinder";

export function useEventFinder() {
  const result = ref<EventFinderOutput | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  async function findEvents(request: EventSearchRequest): Promise<EventFinderOutput> {
    isLoading.value = true;
    error.value = null;

    try {
      const data = await $fetch<EventFinderOutput>("/api/event-finder/plan", {
        method: "POST",
        body: request,
        timeout: 600_000
      });
      result.value = data;
      return data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Something went wrong";
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  function reset() {
    result.value = null;
    error.value = null;
    isLoading.value = false;
  }

  return {
    result: readonly(result),
    isLoading: readonly(isLoading),
    error: readonly(error),
    findEvents,
    reset
  };
}
