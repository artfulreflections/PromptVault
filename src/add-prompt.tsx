import { Form, ActionPanel, Action, showToast, Toast, useNavigation } from "@raycast/api";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Prompt, PromptFormValues } from "./types";
import { addPrompt } from "./storage";

export default function AddPrompt() {
  const { pop } = useNavigation();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(values: PromptFormValues) {
    if (!values.title.trim() || !values.content.trim()) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Required fields missing",
        message: "Title and content are required",
      });
      return;
    }

    setIsLoading(true);

    const prompt: Prompt = {
      id: uuidv4(),
      title: values.title.trim(),
      content: values.content.trim(),
      tags: values.tags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0),
      usageCount: 0,
      lastUsed: 0,
      createdAt: Date.now(),
    };

    await addPrompt(prompt);
    setIsLoading(false);

    await showToast({
      style: Toast.Style.Success,
      title: "Prompt saved!",
      message: prompt.title,
    });

    pop();
  }

  return (
    <Form
      isLoading={isLoading}
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Save Prompt" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField
        id="title"
        title="Title"
        placeholder="e.g., Email Rewrite - Professional"
        info="A descriptive name for this prompt"
      />
      <Form.TextArea
        id="content"
        title="Prompt Content"
        placeholder="Rewrite the following text to be more professional and concise..."
        info="The actual prompt text that will be copied"
      />
      <Form.TextField
        id="tags"
        title="Tags"
        placeholder="writing, email, professional"
        info="Comma-separated tags for organization"
      />
    </Form>
  );
}