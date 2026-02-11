# 🚀 Multi-Repo Sync Guide (Windows / PowerShell)

This guide ensures all developers push their branches (e.g., `branch-evans`, `branch-aisha`) to both the **Client (MigrationGFA)** and **Company (DEV-TNK)** repositories simultaneously.

---

### 1️⃣ Initial Setup (One-time only)
Run these commands in your terminal to create a "master remote" that points to both repositories.

> **Note:** Replace `<YOUR-DEV-TNK-PAT>` with your Personal Access Token from the DEV-TNK account.

```powershell
# 1. Create the 'all' remote pointing to the Client repo
git remote add all [https://github.com/MigrationGFA/stp-alumni.git](https://github.com/MigrationGFA/stp-alumni.git)

# 2. Register the Client URL for pushing
git remote set-url --add --push all [https://github.com/MigrationGFA/stp-alumni.git](https://github.com/MigrationGFA/stp-alumni.git)

# 3. Register the Company (DEV-TNK) URL for pushing
git remote set-url --add --push all https://x-access-token:<YOUR-DEV-TNK-PAT>@[github.com/DEV-TNK/stp-alumni.git](https://github.com/DEV-TNK/stp-alumni.git)

---

### 2️⃣ Verify Configuration

To ensure everything is linked correctly, run:
PowerShell

```powershell
git remote -v

Expected Output:

    all (fetch) -> MigrationGFA

    all (push) -> MigrationGFA

    all (push) -> DEV-TNK
---

### 3️⃣ Pushing Your Branch

When you are finished with your local commits on your specific branch, push to both repos with one command:
PowerShell

# Replace 'your-branch-name' with branch-evans, branch-aisha, etc.
```powershell
git push all your-branch-name

If you need to sync the repos to match your local state exactly (mirroring), use the force flag:
PowerShell

```powershell
git push all your-branch-name --force

### 4️⃣ Merging Workflow

    Push: Use the command above to send your branch to both accounts.

    Review: - Open a Pull Request (PR) on MigrationGFA for client preview.

        Open a Pull Request (PR) on DEV-TNK for company records.

    Merge: Merge the PRs on GitHub rather than merging locally to keep history clean.