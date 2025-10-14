# Quick Security Guide

**⚠️ URGENT**: If you shared a GitHub Personal Access Token (PAT), follow this guide immediately.

---

## 🚨 I Accidentally Exposed My Token - What Do I Do?

### Step 1: Revoke the Token NOW (5 minutes)

1. **Go to GitHub Settings**: https://github.com/settings/tokens
2. **Find your token** in the list (it might be named or just show the date created)
3. **Click "Revoke"** next to the token
4. **Confirm** the revocation

**✅ Done? Great! The token is now useless and can't be used to access your repositories.**

---

### Step 2: Check if the Token Was Used (10 minutes)

1. **Go to Security Log**: https://github.com/settings/security-log
2. **Look for today's date** (October 14, 2025)
3. **Check for suspicious activity**:
   - Pushes or commits you didn't make
   - Repository access from unknown IPs
   - Settings changes you didn't authorize

**See something suspicious?** Contact GitHub Support immediately: https://support.github.com/

---

### Step 3: Create a New Token (If Still Needed) (5 minutes)

Only create a new token if you actually need it for development.

1. **Go to**: https://github.com/settings/tokens/new
2. **Name your token**: e.g., "Development - Local Machine - Expires Jan 2026"
3. **Set expiration**: Choose 90 days (recommended) or less
4. **Select scopes**: 
   - For this project, check ONLY: `repo` (Full control of private repositories)
   - **Don't** select admin scopes unless absolutely necessary
5. **Generate token**
6. **Copy the token** - you'll only see it once!
7. **Store it in a password manager** (NOT in a text file on your desktop!)

---

### Step 4: Use Your New Token Securely (2 minutes)

The safest way to use your token for git operations:

```bash
# Method 1: Let git prompt you (Recommended)
git push
# When prompted:
# Username: your-github-username
# Password: paste-your-new-token-here

# Git will remember it securely after first use
```

**Alternative method** (if you need to configure it):
```bash
# On Windows/Mac/Linux with Git Credential Manager installed:
git config --global credential.helper store

# Next time you push, git will prompt once and remember securely
```

---

## 🔐 How to Avoid This in the Future

### DO ✅

- **Store tokens in password managers** (1Password, Bitwarden, LastPass)
- **Use Git Credential Manager** to handle tokens automatically
- **Set token expiration dates** (90 days max recommended)
- **Use minimum required permissions** for tokens
- **Review security checklist** before each commit

### DON'T ❌

- **Never share tokens in chat or messages**
- **Never put tokens in code files**
- **Never screenshot tokens**
- **Never commit `.env` files with tokens**
- **Never use tokens with admin permissions unless absolutely necessary**

---

## 📋 Quick Security Checklist

Before working on this project:

- [ ] My GitHub token is stored in a password manager
- [ ] My token has an expiration date set
- [ ] My token has minimum required permissions
- [ ] I've read SECURITY.md
- [ ] I've installed the pre-commit hook (optional but recommended)

Before committing code:

- [ ] No API keys in my code
- [ ] No tokens in my code
- [ ] `.env` files are in .gitignore
- [ ] I've reviewed `git diff` before committing

---

## 🛠️ Install Pre-commit Hook (Optional - 2 minutes)

To automatically check for tokens before each commit:

```bash
# Copy the pre-commit hook
cp .githooks/pre-commit.sample .git/hooks/pre-commit

# Make it executable
chmod +x .git/hooks/pre-commit
```

Now git will automatically scan for tokens before each commit and warn you if it finds any!

---

## 📚 More Information

- **Full Security Policy**: [SECURITY.md](SECURITY.md)
- **Developer Checklist**: [SECURITY-CHECKLIST.md](SECURITY-CHECKLIST.md)
- **Incident Details**: [INCIDENT-RESPONSE.md](INCIDENT-RESPONSE.md)
- **Pre-commit Hooks**: [.githooks/README.md](.githooks/README.md)

---

## 🆘 Need Help?

### Token Issues
- GitHub Docs: https://docs.github.com/en/authentication
- GitHub Support: https://support.github.com/

### Project Questions
- Check the README.md
- Review the documentation files
- Contact the repository maintainers

---

**Remember**: Security is everyone's responsibility. When in doubt, revoke the token and create a new one!

**Last Updated**: October 14, 2025
