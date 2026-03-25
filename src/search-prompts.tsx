import {
  List,
  ActionPanel,
  Action,
  Clipboard,
  showToast,
  Toast,
  confirmAlert,
  Alert,
  Icon,
  Keyboard,
} from "@raycast/api";
import { useState, useEffect } from "react";
import { Prompt } from "./types";
import { getPrompts, recordUsage, deletePrompt } from "./storage";

export default function SearchPrompts() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPrompts();
  }, []);

  async function loadPrompts() {
    const data = await getPrompts();
    // Sort by frecency: usage count weighted by recency
    const sorted = data.sort((a, b) => {
      const scoreA = a.usageCount * 10 + (a.lastUsed || a.createdAt);
      const scoreB = b.usageCount * 10 + (b.lastUsed || b.createdAt);
      return scoreB - scoreA;
    });
    setPrompts(sorted);
    setIsLoading(false);
  }

  async function handleCopy(prompt: Prompt) {
    await Clipboard.copy(prompt.content);
    await recordUsage(prompt.id);
    await showToast({
      style: Toast.Style.Success,
      title: "Copied!",
      message: prompt.title,
    });
    // Refresh to update sort order
    await loadPrompts();
  }

  async function handleDelete(prompt: Prompt) {
    const confirmed = await confirmAlert({
      title: "Delete Prompt?",
      message: `Are you sure you want to delete "${prompt.title}"?`,
      primaryAction: {
        title: "Delete",
        style: Alert.ActionStyle.Destructive,
      },
    });

    if (confirmed) {
      await deletePrompt(prompt.id);
      await loadPrompts();
      await showToast({
        style: Toast.Style.Success,
        title: "Deleted",
        message: prompt.title,
      });
    }
  }

  const filteredPrompts = prompts.filter((prompt) => {
    const search = searchText.toLowerCase();
    return (
      prompt.title.toLowerCase().includes(search) ||
      prompt.content.toLowerCase().includes(search) ||
      prompt.tags.some((tag) => tag.toLowerCase().includes(search))
    );
  });

  return (
    <List
      isLoading={isLoading}
      searchText={searchText}
      onSearchTextChange={setSearchText}
      searchBarPlaceholder="Search prompts by title, content, or tag..."
      filtering={false}
    >
      {filteredPrompts.map((prompt) => (
        <List.Item
          key={prompt.id}
          title={prompt.title}
          subtitle={prompt.tags.join(", ")}
          accessories={[
            { text: `${prompt.usageCount} uses` },
          ]}
          actions={
            <ActionPanel>
              <Action
                title="Copy to Clipboard"
                icon={Icon.Clipboard}
                onAction={() => handleCopy(prompt)}
              />
              <Action
                title="Edit Prompt"
                icon={Icon.Pencil}
                shortcut={{ modifiers: ["cmd"], key: "e" }}
                onAction={() => {
                  // Navigate to edit view
                }}
              />
              <Action
                title="Delete Prompt"
                icon={Icon.Trash}
                shortcut={{ modifiers: ["cmd"], key: "d" }}
                onAction={() => handleDelete(prompt)}
              />
              <Action.CopyToClipboard
                title="Copy Prompt ID"
                content={prompt.id}
                shortcut={{ modifiers: ["cmd", "shift"], key: "c" }}
              />
            </ActionPanel>
          }
        />
      ))}
      {filteredPrompts.length === 0 && !isLoading && (
        <List.EmptyView
          icon={Icon.Document}
          title="No prompts found"
          description={
            searchText
              ? "Try a different search term"
              : "Add your first prompt with 'Add Prompt' command"
          }
        />
      )}
    </List>
  );
}