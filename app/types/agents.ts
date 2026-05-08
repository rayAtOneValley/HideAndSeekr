export type AgentStatus = "idle" | "running" | "complete" | "failed";

export interface AgentTask {
  id: string;
  description: string;
  completedAt?: string;
}

export interface AgentState {
  id: string;
  name: string;
  icon: string;
  description: string;
  status: AgentStatus;
  reasoning?: string;
  completedTasks: AgentTask[];
  confidenceScore?: number;
  startedAt?: number;
  completedAt?: number;
}

export interface SeekrAgent {
  id: string;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SeekrAgentsResponse {
  agents: SeekrAgent[];
  total?: number;
}
