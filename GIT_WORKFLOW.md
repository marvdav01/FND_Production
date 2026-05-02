# GIT WORKFLOW & COMMIT GUIDE

## Repository Information

```
Repository: Ediswar03/FND_Production
Owner: Ediswar03
Default Branch: main
Deploy Trigger: Any push to main triggers Vercel deployment
```

## Git Workflow

### Initial Setup

```bash
# Clone repository
git clone https://github.com/Ediswar03/FND_Production.git
cd FND_Production

# Verify remote
git remote -v
# origin  https://github.com/Ediswar03/FND_Production.git (fetch)
# origin  https://github.com/Ediswar03/FND_Production.git (push)

# Create tracking branch untuk main
git branch --track main origin/main
```

### Feature Development Workflow

#### 1. Create Feature Branch

```bash
# Update main branch
git checkout main
git pull origin main

# Create feature branch
git checkout -b feature/event-booking

# Or use descriptive names for fixes, docs, etc.
git checkout -b fix/auth-bug
git checkout -b docs/api-documentation
git checkout -b refactor/event-service
```

#### 2. Make Changes & Commits

```bash
# Make changes to files
# ... edit code ...

# Stage changes
git add .
# Or stage specific files
git add app/admin/events/page.tsx components/EventForm.tsx

# Check status
git status

# Commit with descriptive message
git commit -m "feat: add event booking form with validation"

# Make more changes
# ... more edits ...

# Commit again
git commit -m "fix: resolve form submission bug"
```

#### 3. Push to Remote

```bash
# Push feature branch
git push origin feature/event-booking

# If branch doesn't exist on remote yet:
git push -u origin feature/event-booking

# Verify push
git log origin/feature/event-booking
```

#### 4. Create Pull Request

```
1. Go to https://github.com/Ediswar03/FND_Production
2. GitHub suggests "Create Pull Request" button
3. Set:
   - Base: main
   - Compare: feature/event-booking
   - Title: "Feat: Add event booking form"
   - Description: Describe changes, related issues
4. Click "Create Pull Request"
```

#### 5. Code Review & Merge

```bash
# After approval, merge via GitHub UI
# Or merge locally:

git checkout main
git pull origin main
git merge feature/event-booking

# Push merged changes
git push origin main

# Delete feature branch locally & remote
git branch -d feature/event-booking
git push origin --delete feature/event-booking
```

## Commit Message Convention

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation only
- `style` - Formatting, missing semicolons, etc (no code change)
- `refactor` - Code change without feature/fix
- `perf` - Performance improvement
- `test` - Adding or updating tests
- `chore` - Build, dependencies, tooling

### Scope (Optional)

- `events` - Event management
- `crew` - Crew management  
- `equipment` - Equipment/inventory
- `payments` - Payment tracking
- `auth` - Authentication
- `admin` - Admin portal
- `client` - Client portal
- `crew` - Crew portal
- `api` - API endpoints
- `db` - Database/schema

### Subject

Guidelines:
- Use imperative mood ("add" not "added" or "adds")
- Don't capitalize first letter
- No period (.) at the end
- Limit to 50 characters

### Body (Optional)

- Explain what and why, not how
- Wrap at 72 characters
- Separate from subject with blank line

### Footer (Optional)

- Reference issues: `Fixes #123` atau `Closes #456`
- Note breaking changes: `BREAKING CHANGE: remove /events endpoint`

### Examples

```bash
# Simple feature
git commit -m "feat: add event status workflow"

# With scope and body
git commit -m "feat(events): add event status workflow

Implement 6-state workflow for events:
pending → survey → deal → running → selesai/cancel

Users can transition through statuses via admin dashboard
Change tracked in event_status_history table for audit"

# Bug fix with issue reference
git commit -m "fix(auth): resolve session timeout issue

Sessions now properly refresh before expiry
Fixes #234"

# Documentation
git commit -m "docs: update API documentation"

# Refactoring with scope
git commit -m "refactor(events): extract validation logic to service"

# Performance improvement
git commit -m "perf(events): add database indexes for queries"

# Breaking change
git commit -m "feat(api)!: remove deprecated endpoints

BREAKING CHANGE: /api/events/legacy endpoint is removed"
```

## Current Repository State

### Main Branch

```
Latest commits:
- fix: resolve hydration mismatch on root layout
- fix: add validation for Supabase credentials
- Initial project setup
```

### Development Status

**Completed Features:**
- ✅ Multi-portal architecture
- ✅ Authentication system
- ✅ Event management CRUD
- ✅ Equipment/inventory system
- ✅ Crew management
- ✅ Payment tracking
- ✅ Dashboard with analytics
- ✅ Responsive design

**Planned Features (Next Phase):**
- 📋 Real-time notifications
- 📋 Email/SMS integration
- 📋 Advanced reporting & export
- 📋 Mobile app
- 📋 Calendar view

## Handling Common Scenarios

### Scenario 1: Sync with Latest Changes from Main

```bash
git checkout main
git pull origin main

git checkout feature/my-feature
git rebase main
# If conflicts occur, resolve them and continue:
# git rebase --continue
```

### Scenario 2: Squash Multiple Commits Before Merge

```bash
# Interactive rebase
git rebase -i main

# In editor, mark some commits as 'squash' or 's'
# Save & resolve any conflicts
# Push with force (⚠️ only on your branch):
git push origin feature/my-feature --force-with-lease
```

### Scenario 3: Undo Last Commit (Not Published)

```bash
# Keep changes, undo commit
git reset --soft HEAD~1

# Discard everything
git reset --hard HEAD~1
```

### Scenario 4: Revert Published Commit

```bash
# Create new commit that reverses changes
git revert abc123def

git push origin main
```

### Scenario 5: Stash Work in Progress

```bash
# Save changes without committing
git stash

# Work on different branch
git checkout fix/urgent-bug

# Come back and restore
git checkout feature/my-feature
git stash pop
```

## Git Best Practices

### ✅ DO

- ✅ Pull before starting work
- ✅ Create descriptive branch names
- ✅ Make small, atomic commits
- ✅ Write clear commit messages
- ✅ Push to remote regularly
- ✅ Create PR for code review
- ✅ Test locally before pushing
- ✅ Delete merged branches

### ❌ DON'T

- ❌ Commit directly to main
- ❌ Mix multiple features in one commit
- ❌ Use generic messages ("update", "fix bug")
- ❌ Force push on shared branches
- ❌ Leave large uncommitted changes
- ❌ Commit sensitive data (.env, keys)
- ❌ Skip testing before push

## Useful Git Commands

```bash
# View commit history
git log
git log --oneline
git log --graph --all --decorate
git log --author="Your Name"

# View changes
git diff
git diff HEAD
git show abc123

# Branches
git branch -a              # List all branches
git branch -d branch-name  # Delete local
git push origin --delete branch-name  # Delete remote

# Tagging releases (optional)
git tag v1.0.0
git push origin v1.0.0

# Finding issues
git bisect start           # Find which commit broke things
git grep "function-name"   # Search in code

# Cleanup
git gc                     # Cleanup repository
git clean -fd              # Remove untracked files
```

## GitHub Repository Setup

### Branch Protection Rules (for main)

Should configured:
- ✅ Require pull request reviews before merging
- ✅ Require code review from code owners
- ✅ Require status checks to pass
- ✅ Dismiss stale reviews
- ✅ Require branches be up to date

### Automated Workflows

**Vercel Deployment:**
- Auto-deploys on main branch push
- Preview deployments for PRs
- Status checks reported to GitHub

## Team Collaboration

### Getting Code

```bash
# View team member's branch
git fetch origin

# Checkout their branch
git checkout feature/colleague-feature

# Test their changes locally
```

### Reviewing Pull Requests

```
1. Go to PR on GitHub
2. Click "Files changed" tab
3. Review code
4. Add comments on specific lines
5. Click "Review changes" → Select "Approve" or "Request changes"
6. Click "Merge pull request" (if approved)
```

## Release Process

```bash
# When ready for release:
git checkout main
git pull origin main

# Create release tag
git tag v1.1.0
git push origin v1.1.0

# Deploy (auto via Vercel webhook)
# Or manually deploy to production
```

## Troubleshooting

### I accidentally committed to main

```bash
# If not pushed yet:
git reset HEAD~1
git checkout -b feature/fix
git commit -m "feat: fix"

# If already pushed (after team coordination):
git revert abc123
git push origin main
```

### I need to undo a pushed commit

```bash
# Create revert commit (safe for shared branches)
git revert abc123
git push origin main
```

### I have merge conflicts

```bash
# After pulling:
git status  # See conflicted files

# Edit conflicted files (resolve manually)
# Look for <<<<<<, ======, >>>>>> markers

git add resolved-file.ts
git commit -m "fix: resolve merge conflict"
git push origin feature/branch
```

## Links

- GitHub: https://github.com/Ediswar03/FND_Production
- Vercel Dashboard: https://vercel.com/dashboard
- Git Docs: https://git-scm.com/doc
- GitHub Docs: https://docs.github.com/

---

**Git Workflow Guide v1.0 - Last Updated: 2 Mei 2026**
