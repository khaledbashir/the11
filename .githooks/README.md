# Git Hooks

This directory contains sample Git hooks to help prevent accidental commits of sensitive data.

## Available Hooks

### pre-commit.sample

A pre-commit hook that scans staged files for potential secrets and tokens, including:
- GitHub Personal Access Tokens (PATs)
- OpenRouter API keys
- AWS credentials
- Private keys
- JWT tokens

## Installation

To enable the pre-commit hook:

```bash
# Copy the sample to your .git/hooks directory
cp .githooks/pre-commit.sample .git/hooks/pre-commit

# Make it executable
chmod +x .git/hooks/pre-commit
```

## Usage

Once installed, the hook will automatically run before each commit. If it detects potential secrets:
- The commit will be blocked
- You'll see which files and patterns triggered the detection
- You'll need to remove the sensitive data before committing

### Bypassing the Hook

If you're certain the detection is a false positive, you can bypass the hook:

```bash
git commit --no-verify -m "Your commit message"
```

**⚠️ Warning**: Only bypass the hook if you're absolutely certain there are no secrets in your commit.

## Customization

You can customize the patterns detected by editing the `PATTERNS` array in the hook file.

## Additional Security Tools

For more comprehensive secret scanning, consider:
- [git-secrets](https://github.com/awslabs/git-secrets)
- [detect-secrets](https://github.com/Yelp/detect-secrets)
- [gitleaks](https://github.com/gitleaks/gitleaks)
- [trufflehog](https://github.com/trufflesecurity/trufflehog)

## References

- [Git Hooks Documentation](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks)
- [SECURITY.md](../SECURITY.md) - Project security policy
