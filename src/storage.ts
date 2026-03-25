import { LocalStorage } from "@raycast/api";
import { Prompt } from "./types";

const STORAGE_KEY = "promptvault-data-v1";

export async function getPrompts(): Promise<Prompt[]> {
  const data = await LocalStorage.getItem<string>(STORAGE_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function savePrompts(prompts: Prompt[]): Promise<void> {
  await LocalStorage.setItem(STORAGE_KEY, JSON.stringify(prompts));
}

export async function getPromptById(id: string): Promise<Prompt | undefined> {
  const prompts = await getPrompts();
  return prompts.find((p) => p.id === id);
}

export async function addPrompt(prompt: Prompt): Promise<void> {
  const prompts = await getPrompts();
  prompts.push(prompt);
  await savePrompts(prompts);
}

export async function updatePrompt(updated: Prompt): Promise<void> {
  const prompts = await getPrompts();
  const index = prompts.findIndex((p) => p.id === updated.id);
  if (index !== -1) {
    prompts[index] = updated;
    await savePrompts(prompts);
  }
}

export async function deletePrompt(id: string): Promise<void> {
  const prompts = await getPrompts();
  const filtered = prompts.filter((p) => p.id !== id);
  await savePrompts(filtered);
}

export async function recordUsage(id: string): Promise<void> {
  const prompts = await getPrompts();
  const prompt = prompts.find((p) => p.id === id);
  if (prompt) {
    prompt.usageCount++;
    prompt.lastUsed = Date.now();
    await savePrompts(prompts);
  }
}

export async function exportToJson(): Promise<string> {
  const prompts = await getPrompts();
  return JSON.stringify(prompts, null, 2);
}

export async function importFromJson(json: string): Promise<boolean> {
  try {
    const prompts: Prompt[] = JSON.parse(json);
    if (Array.isArray(prompts)) {
      await savePrompts(prompts);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}