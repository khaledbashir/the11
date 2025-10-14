# Security Checklist for Social Garden SOW Generator

This checklist helps ensure security best practices are followed throughout the development lifecycle.

## 📋 Pre-Development Setup

- [ ] Read [SECURITY.md](SECURITY.md) thoroughly
- [ ] Install pre-commit hook from `.githooks/pre-commit.sample`
- [ ] Create `.env.local` file for local API keys
- [ ] Verify `.env.local` is in `.gitignore`
- [ ] Never commit `.env` files to the repository

## 🔐 API Key Management

### OpenRouter API Key
- [ ] Obtain key from [OpenRouter](https://openrouter.ai/keys)
- [ ] Store in `.env.local` only, never in source code
- [ ] Use `process.env.OPENROUTER_API_KEY` in code
- [ ] Set key expiration date if possible
- [ ] Document key purpose and permissions

### GitHub Personal Access Tokens
- [ ] Use tokens with minimal required scopes
- [ ] Set token expiration (90 days recommended)
- [ ] Store securely in password manager
- [ ] Never share in chat, issues, or commits
- [ ] Revoke immediately if accidentally exposed

## 💻 Development Practices

### Code Review Checklist
- [ ] No hardcoded API keys or tokens
- [ ] No passwords or credentials in code
- [ ] Environment variables used for all secrets
- [ ] No sensitive data in console logs
- [ ] No debug statements with credentials
- [ ] Input validation implemented
- [ ] Error messages don't expose sensitive data

### Before Each Commit
- [ ] Run pre-commit hook (if installed)
- [ ] Review `git diff` for any secrets
- [ ] Check commit message for sensitive info
- [ ] Verify no `.env` files are staged
- [ ] Confirm all changes are intentional

### Testing
- [ ] Use test/mock credentials, never production keys
- [ ] Ensure test data doesn't contain real sensitive information
- [ ] Verify test .env files are gitignored
- [ ] Clean up test credentials after testing

## 🚀 Deployment Checklist

### Pre-Deployment
- [ ] All API keys moved to environment variables
- [ ] No hardcoded credentials in source code
- [ ] `.env` files configured for production
- [ ] Rate limiting implemented
- [ ] Input validation and sanitization added
- [ ] Error handling doesn't expose sensitive data
- [ ] CORS configured properly
- [ ] HTTPS enabled

### Production Environment
- [ ] Environment variables set in deployment platform
- [ ] API keys rotated from development
- [ ] Monitoring and alerting configured
- [ ] Security headers implemented
- [ ] Audit logging enabled
- [ ] Backup and recovery tested

### Post-Deployment
- [ ] Verify no secrets in client-side code
- [ ] Test rate limiting functionality
- [ ] Review API usage patterns
- [ ] Check security headers are working
- [ ] Monitor logs for suspicious activity

## 🔄 Ongoing Maintenance

### Monthly Tasks
- [ ] Review GitHub audit logs
- [ ] Check for unusual API usage
- [ ] Update dependencies for security patches
- [ ] Review and update .gitignore
- [ ] Test backup and recovery procedures

### Quarterly Tasks
- [ ] Rotate API keys and tokens
- [ ] Review access controls
- [ ] Update security documentation
- [ ] Conduct security assessment
- [ ] Review incident response procedures

### Annual Tasks
- [ ] Comprehensive security audit
- [ ] Update security policies
- [ ] Review and update third-party integrations
- [ ] Test disaster recovery plan

## 🚨 Incident Response

If a security incident occurs (e.g., token exposed):

### Immediate Actions (Within 5 minutes)
- [ ] Revoke compromised credential immediately
- [ ] Document what was exposed and where
- [ ] Check if credential was used

### Short-term Actions (Within 1 hour)
- [ ] Generate new credentials
- [ ] Update all systems using old credentials
- [ ] Review logs for unauthorized access
- [ ] Notify relevant stakeholders

### Follow-up Actions (Within 24 hours)
- [ ] Complete incident report
- [ ] Identify root cause
- [ ] Implement preventive measures
- [ ] Update security documentation
- [ ] Share lessons learned with team

## 📚 Critical Issues from Production Improvements

Based on `PRODUCTION-IMPROVEMENTS.md`, these MUST be fixed before production:

### 🔴 Critical Priority
- [ ] Move OpenRouter API key from client-side to server-side API routes
- [ ] Create `/api/chat` endpoint to proxy OpenRouter requests
- [ ] Create `/api/pdf` endpoint to proxy PDF service requests
- [ ] Remove hardcoded API keys from `page.tsx` and `agent-sidebar.tsx`
- [ ] Implement rate limiting on API endpoints
- [ ] Add input validation and sanitization

### 🟡 High Priority
- [ ] Implement proper error handling without exposing internals
- [ ] Add request logging and monitoring
- [ ] Set up API usage alerts
- [ ] Implement CORS whitelist for production
- [ ] Add security headers (CSP, HSTS, etc.)

## 🛠️ Tools and Resources

### Recommended Tools
- [git-secrets](https://github.com/awslabs/git-secrets) - Prevents committing secrets
- [detect-secrets](https://github.com/Yelp/detect-secrets) - Scans for secrets in codebase
- [gitleaks](https://github.com/gitleaks/gitleaks) - Secret scanning for git repos
- [1Password](https://1password.com/) or [Bitwarden](https://bitwarden.com/) - Password management

### Documentation
- [SECURITY.md](SECURITY.md) - Full security policy
- [PRODUCTION-IMPROVEMENTS.md](PRODUCTION-IMPROVEMENTS.md) - Enhancement roadmap
- [README.md](README.md) - Project setup and deployment

### External Resources
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [GitHub Security Best Practices](https://docs.github.com/en/code-security)
- [Next.js Security Headers](https://nextjs.org/docs/app/api-reference/next-config-js/headers)

## ✅ Quick Reference

### Safe Practices
✅ Store keys in `.env.local`  
✅ Use environment variables  
✅ Set token expiration  
✅ Use minimal permissions  
✅ Rotate credentials regularly  
✅ Review code before committing  

### Unsafe Practices
❌ Hardcode API keys in code  
❌ Commit `.env` files  
❌ Share tokens in chat/issues  
❌ Use production keys in development  
❌ Store credentials in documentation  
❌ Screenshot/log sensitive data  

---

**Last Updated**: October 2025  
**Version**: 1.0  
**Maintained By**: Social Garden Development Team
