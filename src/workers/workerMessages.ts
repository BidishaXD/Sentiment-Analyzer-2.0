import type { Message } from "../types/message";
import type { Conversation } from "../types/conversation";

/**
 * Discriminator actions for incoming worker messages.
 */
export type WorkerAction = "RUN_ANALYSIS";

/**
 * Expected data structure passed into the background thread.
 */
export interface WorkerRequestPayload {
  action: WorkerAction;
  messages: Message[];
  conversationTitle: string;
  conversationId: string;
}

/**
 * Structured response emitted back to the main UI thread upon processing completion.
 */
export interface WorkerResponsePayload {
  success: boolean;
  conversation?: Conversation;
  messages?: Message[];
  error?: string;
}