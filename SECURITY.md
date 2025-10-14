# Security Policy

## 🔒 Reporting Security Issues

If you discover a security vulnerability in this project, please report it by:

1. **DO NOT** create a public GitHub issue
2. Email the maintainers directly or use GitHub's private security advisory feature
3. Provide detailed information about the vulnerability

## 🚨 Important Security Notice

### GitHub Personal Access Tokens (PATs)

**CRITICAL**: If you have accidentally shared a GitHub Personal Access Token (PAT) in any public or semi-public context (chat logs, issues, comments, commits, etc.):

1. **Immediately revoke the token** at: https://github.com/settings/tokens
2. Generate a new token if still needed
3. Update any systems using the old token
4. Review GitHub's audit log for any unauthorized access

**Never share PAT tokens in**:
- Chat messages or conversations
- Issue comments or descriptions
- Pull request descriptions or comments
- Commit messages
- Source code files
- Documentation files
- Screenshots or images

## 🔐 API Key Management

This project uses API keys for various services:

### OpenRouter API Key
- **Storage**: Store in `.env.local` file (already gitignored)
- **Usage**: For AI chat functionality
- **Best Practice**: Use environment variables, never hardcode in source files

### Current Security Concerns

From `PRODUCTION-IMPROVEMENTS.md`:
- 🔴 API keys currently hardcoded in client-side code (MUST FIX)
- 🔴 No rate limiting on API calls
- 🔴 No input validation or sanitization

### Recommendations Before Production

1. **Move API Keys to Environment Variables**
   ```bash
   # In novel-editor-demo/apps/web/.env.local
   OPENROUTER_API_KEY=your-key-here
   NEXT_PUBLIC_PDF_SERVICE_URL=http://localhost:8000
   ```

2. **Create API Route Handlers**
   - Create `/api/chat` endpoint to keep keys server-side
   - Create `/api/pdf` endpoint for PDF generation
   - Never expose API keys in client-side code

3. **Implement Rate Limiting**
   - Add rate limiting middleware
   - Prevent abuse of API endpoints
   - Monitor API usage

## 📋 Security Checklist for Developers

### Before Committing Code

- [ ] No API keys or tokens in source code
- [ ] No passwords or credentials in configuration files
- [ ] `.env` files are listed in `.gitignore`
- [ ] No sensitive data in commit messages
- [ ] No debug logs with sensitive information

### Before Deploying

- [ ] All API keys moved to environment variables
- [ ] Rate limiting implemented
- [ ] Input validation added
- [ ] HTTPS enabled for production
- [ ] Security headers configured
- [ ] CORS properly configured

### Regular Security Maintenance

- [ ] Rotate API keys regularly (every 90 days recommended)
- [ ] Review GitHub audit logs monthly
- [ ] Update dependencies for security patches
- [ ] Monitor for unusual API usage patterns
- [ ] Review and update .gitignore regularly

## 🛡️ Best Practices

### 1. Environment Variables

Always use environment variables for sensitive data:

```typescript
// ✅ CORRECT
const apiKey = process.env.OPENROUTER_API_KEY;

// ❌ WRONG
const apiKey = "sk-or-v1-abc123...";
```

### 2. Git History

If sensitive data was committed:

```bash
# DON'T try to remove from git history
# Force push is disabled for this repository

# DO:
# 1. Revoke the compromised credential immediately
# 2. Generate new credentials
# 3. Update your .env files
# 4. Add to .gitignore if not already present
```

### 3. Token Hygiene

- Use tokens with minimal required permissions
- Set token expiration dates
- Use different tokens for different environments
- Document what each token is used for

### 4. Code Reviews

During code reviews, specifically check for:
- Hardcoded credentials
- Exposed API keys
- Sensitive data in logs
- Missing input validation
- Insecure configurations

## 📚 Additional Resources

- [GitHub Token Security Best Practices](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
- [OWASP API Security Top 10](https://owasp.org/www-project-api-security/)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)

## 🔄 Incident Response

If a security incident occurs:

1. **Contain**: Revoke compromised credentials immediately
2. **Assess**: Determine the scope of the breach
3. **Remediate**: Fix the vulnerability
4. **Document**: Record what happened and how it was fixed
5. **Communicate**: Inform affected parties if necessary
6. **Learn**: Update processes to prevent recurrence

## 📞 Contact

For security concerns, contact the repository maintainers.

---

**Last Updated**: October 2025
**Version**: 1.0
