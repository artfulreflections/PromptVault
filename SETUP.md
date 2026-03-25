# PromptVault Development Setup

## Local Development

```bash
# 1. Install dependencies
npm install

# 2. Run in development mode
npm run dev

# 3. In Raycast, run "Search Prompts" command to test
```

## Publishing to GitHub

```bash
# Add remote and push
git remote add origin https://github.com/artfulreflections/promptvault-raycast.git
git branch -M main
git push -u origin main
```

## Publishing to Raycast Store

```bash
# Build first
npm run build

# Publish (requires Raycast developer account)
npm run publish
```

## Project Structure

```
promptvault-raycast/
├── src/
│   ├── types.ts           # TypeScript interfaces
│   ├── storage.ts         # LocalStorage wrapper
│   ├── search-prompts.tsx # Main list view
│   ├── add-prompt.tsx     # Add prompt form
│   └── quick-copy.tsx     # Tag-filtered quick copy
├── package.json           # Extension manifest
├── tsconfig.json          # TypeScript config
├── README.md              # Documentation
└── CHANGELOG.md           # Version history
```

## Features

- ⚡ Lightning-fast copy (< 2 seconds)
- 🏷️ Tag-based organization
- 📊 Frecency sorting (usage + recency)
- ⌨️ Full keyboard navigation
- 🔒 100% local storage
