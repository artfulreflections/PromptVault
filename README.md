# PromptVault

Instant prompt storage and copy-paste for AI workflows. A Raycast extension.

![PromptVault Demo](assets/demo.png)

## Features

- ⚡ **Lightning-fast copy** — Find and copy prompts in under 2 seconds
- 🏷️ **Tag-based organization** — Organize prompts with comma-separated tags
- 🔍 **Smart search** — Search by title, content, or tags
- 📊 **Frecency sorting** — Most-used prompts bubble to the top
- ⌨️ **Keyboard-first** — Navigate and copy without touching your mouse
- 🔒 **Local-first** — All data stored locally, no cloud required
- 📤 **Import/Export** — JSON backup and restore

## Commands

| Command | Description | Shortcut |
|---------|-------------|----------|
| **Search Prompts** | Find and copy saved prompts | Type "prompts" |
| **Add Prompt** | Save a new prompt | Type "add prompt" |
| **Quick Copy** | Copy by tag filter | Type "quick [tag]" |

## Installation

### From Raycast Store (Coming Soon)

Search "PromptVault" in the Raycast Store and install.

### Manual Installation

```bash
git clone https://github.com/artfulreflections/promptvault-raycast.git
cd promptvault-raycast
npm install
npm run build
npm run install-extension
```

## Usage

### Saving a Prompt

1. Open Raycast (`⌘+Space`)
2. Type "add prompt"
3. Enter title, content, and tags
4. Press `↵` to save

### Copying a Prompt

1. Open Raycast (`⌘+Space`)
2. Type "prompts"
3. Search by typing (filters in real-time)
4. Press `↵` to copy

### Quick Copy by Tag

1. Open Raycast (`⌘+Space`)
2. Type "quick email" (or any tag)
3. If one match: auto-copies
4. If multiple: pick from list

## Data Storage

All prompts are stored in Raycast's LocalStorage. To backup or migrate:

```bash
# Export (future release)
⌘+Space → "export prompts"

# Import (future release)  
⌘+Space → "import prompts"
```

## Roadmap

- [x] Core save/copy functionality
- [x] Tag-based organization
- [x] Frecency sorting
- [x] Quick copy by tag
- [ ] Edit existing prompts
- [ ] Variable placeholders (`{{topic}}`)
- [ ] Import/Export JSON
- [ ] Clipboard history integration
- [ ] Raycast Store publication

## Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build

# Lint
npm run lint
```

## License

MIT © Artful Reflections

---

Built with ⚡ for AI power users