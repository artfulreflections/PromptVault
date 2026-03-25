import { List, ActionPanel, Action, Clipboard, showToast, Toast, Icon } from "@raycast/api";
import { useState, useEffect } from "react";
import { Prompt } from "./types";
import { getPrompts, recordUsage } from "./storage";

interface QuickCopyArguments {
  tag?: string;
}

export default function QuickCopy(props: { arguments: QuickCopyArguments }) {
  const { tag } = props.arguments;
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPrompts();
  }, []);

  async function loadPrompts() {
    const allPrompts = await getPrompts();
    const filtered = tag
      ? allPrompts.filter((p) =>
          p.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
        )
      : allPrompts;
    setPrompts(filtered);
    setIsLoading(false);

    // If only one match, copy immediately
    if (filtered.length === 1) {
      await handleCopy(filtered[0]);
    }
  }

  async function handleCopy(prompt: Prompt) {
    await Clipboard.copy(prompt.content);
    await recordUsage(prompt.id);
    await showToast({
      style: Toast.Style.Success,
      title: "Copied!",
      message: prompt.title,
    });
  }

  return (
    <List
      isLoading={isLoading}
      searchBarPlaceholder={tag ? `Prompts tagged "${tag}"` : "All prompts"}
    >
      {prompts.map((prompt) => (
        <List.Item
          key={prompt.id}
          title={prompt.title}
          subtitle={prompt.tags.join(", ")}
          icon={Icon.Clipboard}
          actions={
            <ActionPanel>
              <Action
                title="Copy to Clipboard"
                icon={Icon.Clipboard}
                onAction={() => handleCopy(prompt)}
              />
            </ActionPanel>
          }
        />
      ))}
      {prompts.length === 0 && !isLoading && (
        <List.EmptyView
          icon={Icon.Document}
          title={tag ? `No prompts tagged "${tag}"` : "No prompts found"}
          description="Add prompts with the 'Add Prompt' command"
        />
      )}
    </List>
  );
}