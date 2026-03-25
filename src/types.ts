export interface Prompt {
  id: string;
  title: string;
  content: string;
  tags: string[];
  usageCount: number;
  lastUsed: number;
  createdAt: number;
}

export interface PromptFormValues {
  title: string;
  content: string;
  tags: string;
}