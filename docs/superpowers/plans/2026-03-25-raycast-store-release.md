# PromptVault — Raycast Store Release Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship PromptVault 1.0.0 to the Raycast Extensions Store via the official PR process.

**Architecture:** Two blocking issues remain (author handle + raycastVersion + screenshots), then fork raycast/extensions and submit the store PR. All store assets live in `metadata/` inside the extension directory of the fork.

**Tech Stack:** Raycast API v1.64+, TypeScript, React, `@raycast/api` LocalStorage

**Repo:** `/Users/jeffreycruz/Development/PromptVault`

---

## Gaps to close before submission

| Gap | Severity | Status |
|-----|----------|--------|
| Edit Prompt was a stub | **Blocking** | ✅ Fixed — `edit-prompt.tsx` wired |
| Icon was 640×640px (must be 512×512) | **Blocking** | ✅ Fixed — resized |
| `package.json` missing `raycastVersion` | **Blocking** | ❌ Open → Task 1 |
| `author` not found on raycast.com (`artfulreflections`) | **Blocking** | ❌ Open → Task 1 |
| No screenshots in `metadata/` | **Blocking** | ❌ Open → Task 2 |
| README references missing `assets/demo.png` | Open | ❌ Open → Task 2 |

---

## ~~Task 1: Implement Edit Prompt~~ ✅ DONE

`edit-prompt.tsx` created and wired. `npm run build` passes. Skip to Task 1 below.

---

## Task 1: Fix `package.json` — `raycastVersion` + author

- [ ] **Step 1: Create `src/edit-prompt.tsx`**

```tsx
import { Form, ActionPanel, Action, showToast, Toast, useNavigation } from "@raycast/api";
import { useState } from "react";
import { Prompt, PromptFormValues } from "./types";
import { updatePrompt } from "./storage";

export default function EditPrompt({ prompt, onSave }: { prompt: Prompt; onSave: () => void }) {
  const { pop } = useNavigation();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(values: PromptFormValues) {
    if (!values.title.trim() || !values.content.trim()) {
      await showToast({ style: Toast.Style.Failure, title: "Required fields missing" });
      return;
    }
    setIsLoading(true);
    await updatePrompt({
      ...prompt,
      title: values.title.trim(),
      content: values.content.trim(),
      tags: values.tags.split(",").map((t) => t.trim()).filter((t) => t.length > 0),
    });
    setIsLoading(false);
    await showToast({ style: Toast.Style.Success, title: "Prompt updated!" });
    onSave();
    pop();
  }

  return (
    <Form
      isLoading={isLoading}
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Save Changes" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField id="title" title="Title" defaultValue={prompt.title} />
      <Form.TextArea id="content" title="Prompt Content" defaultValue={prompt.content} />
      <Form.TextField id="tags" title="Tags" defaultValue={prompt.tags.join(", ")} placeholder="writing, email, professional" />
    </Form>
  );
}
```

- [ ] **Step 2: Wire Edit action in `src/search-prompts.tsx`**

Add import at top:
```tsx
import { useNavigation } from "@raycast/api";
import EditPrompt from "./edit-prompt";
```

Add `const { push } = useNavigation();` inside `SearchPrompts()`.

Replace the stub Edit action (line ~107):
```tsx
<Action
  title="Edit Prompt"
  icon={Icon.Pencil}
  shortcut={{ modifiers: ["cmd"], key: "e" }}
  onAction={() => push(<EditPrompt prompt={prompt} onSave={loadPrompts} />)}
/>
```

- [ ] **Step 3: Build to verify no TypeScript errors**

```bash
cd ~/Development/openclaw-docker/workspace/promptvault-raycast
npm install
npm run build
```

Expected: `dist/` populated, zero errors.

- [ ] **Step 4: Commit**

```bash
git add src/edit-prompt.tsx src/search-prompts.tsx
git commit -m "feat: implement Edit Prompt action"
```

---

## Task 2: Finalize `package.json` for store submission

**Files:**
- Modify: `package.json`

The Raycast store requires `raycastVersion` and validates all metadata fields. Verify the `author` matches your Raycast developer account handle (sign in at raycast.com/developers).

- [ ] **Step 1: Add `raycastVersion` and verify author**

Add to `package.json` (top-level, alongside `"license"`):
```json
"raycastVersion": ">=1.64.0",
```

Verify `"author": "artfulreflections"` matches your Raycast developer account exactly. If not, update it now — this field cannot be changed post-submission.

- [ ] **Step 2: Commit**

```bash
git add package.json
git commit -m "chore: add raycastVersion constraint for store submission"
```

---

## Task 3: Run full lint pass

**Files:** All `src/*.tsx`, `src/*.ts`

Raycast CI runs `ray lint` on all submitted extensions. Fix all errors before submitting.

- [ ] **Step 1: Run lint**

```bash
cd ~/Development/openclaw-docker/workspace/promptvault-raycast
npm run lint
```

- [ ] **Step 2: Auto-fix what's fixable**

```bash
npm run fix-lint
```

- [ ] **Step 3: Manually fix any remaining lint errors**

Re-run `npm run lint` until clean.

- [ ] **Step 4: Commit if any fixes were made**

```bash
git add -p
git commit -m "chore: fix lint issues"
```

---

## Task 4: Capture screenshots

**Files:**
- Create: `metadata/promptvault-1.png` — Search Prompts view (populated with sample prompts)
- Create: `metadata/promptvault-2.png` — Add Prompt form
- Create: `metadata/promptvault-3.png` — Quick Copy list filtered by tag

Raycast store requires at least 1 screenshot. Recommended: 3. Resolution: 1280×800 or 2560×1600 (retina). Format: PNG.

Screenshots are placed in `metadata/` inside the extension directory. This folder is also what goes into the raycast/extensions fork.

- [ ] **Step 1: Run extension in dev mode**

```bash
npm run dev
```

Open Raycast, search "Search Prompts". Add 4–5 sample prompts with varied tags first.

- [ ] **Step 2: Screenshot Search Prompts view**

Use macOS `⌘+Shift+4` to screenshot the Raycast window.
Save as `metadata/promptvault-1.png`.

- [ ] **Step 3: Screenshot Add Prompt form**

Open "Add Prompt" command. Screenshot with form visible.
Save as `metadata/promptvault-2.png`.

- [ ] **Step 4: Screenshot Quick Copy by tag**

Open "Quick Copy" with a tag argument. Screenshot the filtered list.
Save as `metadata/promptvault-3.png`.

- [ ] **Step 5: Fix README to use metadata/ paths**

Replace `![PromptVault Demo](assets/demo.png)` in `README.md` with:

```markdown
![Search Prompts](metadata/promptvault-1.png)
```

- [ ] **Step 6: Update README — mark Edit as complete, remove "Coming Soon" from store line**

In the Roadmap section: change `[ ] Edit existing prompts` to `[x] Edit existing prompts`.

Change the Installation > Raycast Store line to remove "(Coming Soon)":
```markdown
Search "PromptVault" in the Raycast Store and install.
```

- [ ] **Step 7: Commit**

```bash
git add metadata/ README.md
git commit -m "docs: add store screenshots and update README"
```

---

## Task 5: Tag v1.0.0 and push to GitHub

**Files:** None (git operations only)

The GitHub repo is already at `https://github.com/artfulreflections/PromptVault.git`. The store PR will reference this repo — it must be public and the `main` branch must be clean.

- [ ] **Step 1: Verify repo is public**

```bash
gh repo view artfulreflections/PromptVault --json visibility -q .visibility
```

Expected: `PUBLIC`. If `PRIVATE`, run:
```bash
gh repo edit artfulreflections/PromptVault --visibility public
```

- [ ] **Step 2: Push all commits**

```bash
git push origin main
```

- [ ] **Step 3: Tag release**

```bash
git tag v1.0.0
git push origin v1.0.0
```

- [ ] **Step 4: Verify on GitHub**

Open `https://github.com/artfulreflections/PromptVault` in a browser and confirm all files are visible and the tag appears under Releases.

---

## Task 6: Fork raycast/extensions and prepare the submission directory

**Files (in the fork):**
- Create: `extensions/promptvault/` — full copy of the extension
- Create: `extensions/promptvault/metadata/` — screenshots (already in your repo)

The Raycast store works via PRs to https://github.com/raycast/extensions. Your extension lives at `extensions/<name>/`.

- [ ] **Step 1: Fork the extensions repo**

```bash
gh repo fork raycast/extensions --clone=false
```

Expected: `artfulreflections/extensions` created.

- [ ] **Step 2: Clone the fork**

```bash
git clone https://github.com/artfulreflections/extensions.git /tmp/raycast-extensions
cd /tmp/raycast-extensions
```

- [ ] **Step 3: Create a branch**

```bash
git checkout -b add-promptvault
```

- [ ] **Step 4: Copy extension into the fork**

```bash
cp -r ~/Development/openclaw-docker/workspace/promptvault-raycast /tmp/raycast-extensions/extensions/promptvault
# Remove the .git directory from the copy — only the fork's git history matters
rm -rf /tmp/raycast-extensions/extensions/promptvault/.git
rm -rf /tmp/raycast-extensions/extensions/promptvault/docs
```

- [ ] **Step 5: Run the extensions repo install (validates your extension)**

```bash
cd /tmp/raycast-extensions
npm install
# Validate just your extension
cd extensions/promptvault
npm install
npm run build
```

Expected: build passes, no errors.

- [ ] **Step 6: Commit to fork**

```bash
cd /tmp/raycast-extensions
git add extensions/promptvault
git commit -m "feat: add PromptVault extension"
```

- [ ] **Step 7: Push branch**

```bash
git push origin add-promptvault
```

---

## Task 7: Submit the PR

The PR title and description are read by Raycast reviewers. Be specific — include what each command does and why it's useful.

- [ ] **Step 1: Open the PR**

```bash
cd /tmp/raycast-extensions
gh pr create \
  --repo raycast/extensions \
  --title "New Extension: PromptVault — Instant prompt storage and copy-paste for AI workflows" \
  --body "$(cat <<'EOF'
## PromptVault

Instant prompt storage and one-click copy for AI power users. Designed for people who constantly reuse prompts across ChatGPT, Claude, Gemini, and other tools.

### Commands

- **Search Prompts** — Real-time search by title, content, or tag. Frecency sorting (most-used + most-recent at the top). Copy with `↵`.
- **Add Prompt** — Save a new prompt with title, content, and comma-separated tags.
- **Quick Copy by Tag** — Filter prompts by a single tag. Auto-copies if only one match.

### Why this extension

The core use case: mid-conversation, user needs to hold a long response while going on a tangent, then paste it back. Existing clipboard managers don't let you name, tag, or search saved content. PromptVault does.

- 100% local — no accounts, no sync, no privacy concerns
- Keyboard-first design
- MIT license

### Checklist

- [x] Extension builds without errors (`npm run build`)
- [x] Lint passes (`npm run lint`)
- [x] All commands work end-to-end
- [x] Screenshots included
- [x] MIT license
- [x] `raycastVersion` set in package.json
EOF
)"
```

- [ ] **Step 2: Note the PR URL**

Copy the URL from the command output. Raycast reviewers typically respond within 1–5 business days.

- [ ] **Step 3: Watch for reviewer feedback**

```bash
gh pr checks --repo raycast/extensions <PR_NUMBER> --watch
```

If the automated CI fails, read the failure output and fix the issue in your main repo, re-copy to the fork, and push.

---

## Post-submission

Once the PR is merged by Raycast:

- The extension appears in the store within ~24h
- Users install directly from Raycast: `⌘+Space` → "Store" → search "PromptVault"
- Future updates: push to your GitHub repo, then open a new PR on raycast/extensions with the updated files

**Future v1.1 candidates** (already in roadmap, not blocking v1.0):
- Variable placeholders: `{{topic}}` → text fill before copy
- Import/Export JSON (storage layer already has `exportToJson` / `importFromJson`)
- Clipboard history integration
