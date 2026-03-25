# Contributing to PromptVault

## Git Workflow

We follow a **feature → dev → main** branch pattern.

```
feature/my-feature ──→ dev ──→ main
        ↑                        ↑
   new work                production
```

## Branch Structure

| Branch | Purpose | Protection |
|--------|---------|------------|
| `main` | Production-ready code | PR required |
| `dev` | Integration branch for features | PR required |
| `feature/*` | Individual feature work | Push allowed |

## Development Workflow

### Starting New Work

```bash
# Start from dev
git checkout dev
git pull origin dev

# Create feature branch
git checkout -b feature/my-feature-name

# Work, commit, push
git add .
git commit -m "feat: description"
git push -u origin feature/my-feature-name
```

### Merging to Dev

```bash
# Open PR: feature/my-feature → dev
# Required: 1 review, CI passing
# Squash merge preferred
```

### Releasing to Main

```bash
# Open PR: dev → main
# Required: 2 reviews, manual QA
# Create release tag after merge
```

## Commit Convention

```
feat:     New feature
fix:      Bug fix
docs:     Documentation only
style:    Formatting, no code change
refactor: Code restructuring
test:     Adding tests
chore:    Build/tooling changes
```

## Setting Up Local

```bash
git clone https://github.com/artfulreflections/PromptVault.git
cd PromptVault
git checkout dev
npm install
npm run dev
```
