const BASE = "https://flow.seekr.com";

function getHeaders(): Record<string, string> {
  const config = useRuntimeConfig();
  const headers: Record<string, string> = {
    Authorization: config.seekrApiKey as string,
    "Content-Type": "application/json"
  };
  if (typeof config.seekrTeamId === "string" && config.seekrTeamId) {
    headers["x-team-id"] = config.seekrTeamId;
  }
  return headers;
}

export const seekrFetch = async <T>(
  path: string,
  options: {
    method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    body?: unknown;
  } = {}
): Promise<T> => {
  const response = await $fetch<unknown>(`${BASE}${path}`, {
    method: options.method ?? "GET",
    headers: getHeaders(),
    body: options.body ? JSON.stringify(options.body) : undefined
  });
  return response as T;
};

// Threads API — SeekrFlow agent execution
// Correct paths confirmed from SDK source (seekrai 0.14.0):
//   POST /v1/threads/          (trailing slash required)
//   POST /v1/threads/{id}/messages
//   POST /v1/threads/{id}/runs  (body: { agent_id }, response: { run_id, status })
//   GET  /v1/threads/{id}/runs/{run_id}
//   GET  /v1/threads/{id}/messages
export async function runAgentThread(agentId: string, message: string): Promise<string> {
  console.log(`[runAgentThread] Starting for agent ${agentId}`);

  // 1. Create thread (trailing slash is required)
  const thread = await seekrFetch<{ id: string }>("/v1/threads/", {
    method: "POST",
    body: { meta_data: {} }
  });
  console.log(`[runAgentThread] Thread created: ${thread.id}`);

  // 2. Add user message (thread_id must be in body per SDK)
  await seekrFetch(`/v1/threads/${thread.id}/messages`, {
    method: "POST",
    body: { role: "user", content: message, thread_id: thread.id }
  });

  // 3. Create run (agent_id, not assistant_id; response uses run_id not id)
  const run = await seekrFetch<{ run_id: string; status: string }>(`/v1/threads/${thread.id}/runs`, {
    method: "POST",
    body: { agent_id: agentId }
  });
  console.log(`[runAgentThread] Run created: ${run.run_id}, status: ${run.status}`);

  // 4. Poll until complete (max 120s, 3s intervals)
  let status = run.status;
  const runId = run.run_id;

  for (let i = 0; i < 40; i++) {
    if (status === "completed" || status === "failed" || status === "cancelled") break;
    await new Promise((r) => setTimeout(r, 3000));
    const polled = await seekrFetch<{ status: string }>(`/v1/threads/${thread.id}/runs/${runId}`);
    status = polled.status;
    console.log(`[runAgentThread] Poll ${i + 1}: ${status}`);
  }

  if (status !== "completed") {
    throw new Error(`Agent run ended with status: ${status}`);
  }

  // 5. Get the last assistant message (response is a raw array)
  const messages = await seekrFetch<{ role: string; content: string }[]>(
    `/v1/threads/${thread.id}/messages?limit=100&order=asc`
  );

  const msgArray = Array.isArray(messages) ? messages : (messages as unknown as { data: { role: string; content: string }[] }).data ?? [];
  const last = msgArray.filter((m) => m.role === "assistant").at(-1);
  if (!last) throw new Error("No assistant response found");

  console.log(`[runAgentThread] Got response (${last.content.length} chars)`);
  return last.content;
}
