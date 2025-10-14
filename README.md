# Social Garden SOW Generator

A professional, branded Scope of Work generator for Social Garden's marketing automation services. Features AI-powered content generation, Novel editor integration, and professional PDF export.

---

## 🔒 Security Alert

**⚠️ IMPORTANT**: If you've accidentally shared a GitHub token or API key, see [QUICK-SECURITY-GUIDE.md](QUICK-SECURITY-GUIDE.md) for immediate action steps.

For all security-related information, see:
- [QUICK-SECURITY-GUIDE.md](QUICK-SECURITY-GUIDE.md) - Immediate incident response
- [SECURITY.md](SECURITY.md) - Full security policy
- [INCIDENT-RESPONSE.md](INCIDENT-RESPONSE.md) - Detailed incident documentation

---

## 🚀 Quick Start (Docker - Recommended)

### Prerequisites
- Docker & Docker Compose
- Git

### One-Command Deployment
```bash
git clone https://github.com/khaledbashir/the11.git
cd the11
docker-compose up --build
```

**If port 3000 is already in use:**
```bash
git clone https://github.com/khaledbashir/the11.git
cd the11
FRONTEND_PORT=3333 docker-compose up --build
```

**Or run the setup script for port checking:**
```bash
git clone https://github.com/khaledbashir/the11.git
cd the11
./setup.sh
```

That's it! The application will be available at:
- **Frontend**: http://localhost:3000
- **PDF Service**: http://localhost:8000

## 🏗️ Architecture

### Services
- **Frontend** (Next.js): Main application with Novel editor and AI chat
- **PDF Service** (Python/FastAPI): Professional PDF generation with weasyprint

### Key Features
- ✅ Professional Social Garden branding (fonts, colors, logo)
- ✅ AI-powered SOW generation with Claude-3.5-Sonnet
- ✅ Novel editor integration with `/inserttosow` command
- ✅ Professional PDF export with branded styling
- ✅ 82-role rate card with mandatory team composition
- ✅ Commercial rounding and discount presentation
- ✅ localStorage persistence for documents and chat history

## 📋 Usage

1. **Generate SOW**: Use "The Architect" agent to create scopes of work
2. **Insert Content**: Type `/inserttosow` to insert AI-generated content into editor
3. **Edit Professionally**: Use the branded Novel editor with Social Garden styling
4. **Export PDF**: Click "Export PDF" button for professional deliverables

### Sample Prompts
```
"Please create me a scope of work for OakTree client to support them with an email template build - 1x master email template design, development & deployment for HubSpot. At approximately $10,000 cost"
```

## 🔧 Manual Development Setup

If you prefer not to use Docker:

### Frontend Setup
```bash
# Install pnpm if not already installed
npm install -g pnpm

cd novel-editor-demo
pnpm install
cd apps/web
pnpm run dev
```

### PDF Service Setup
```bash
cd pdf-service
pip install -r requirements.txt
python main.py
```

## 🎨 Branding & Styling

- **Primary Color**: Social Garden Green (#8e4c24)
- **Fonts**: Inter (body), Playfair Display (headings)
- **Logo**: Automatically included in PDF exports
- **Professional Tables**: Branded pricing tables with proper styling

## 📊 PDF Export Features

- Professional letterhead with Social Garden branding
- Proper typography and spacing
- Table formatting for pricing summaries
- Footer with contact information
- Print-optimized styling

## 🛠️ Customization

### Adding New Roles
Edit `lib/knowledge-base.ts` to add new roles to the rate card.

### Modifying Branding
Update CSS variables in `styles/globals.css` for color changes.

### PDF Template
Modify `pdf-service/main.py` for custom PDF layouts.

## 🔒 Security Notice

**⚠️ IMPORTANT**: This project handles sensitive API keys and credentials. Please review our [SECURITY.md](SECURITY.md) file before deployment.

### Critical Security Requirements
- **Never commit API keys** to the repository
- **Never share tokens** in chat messages, issues, or pull requests
- **Always use environment variables** for sensitive data
- **Review the security checklist** in SECURITY.md before deployment

If you accidentally expose a token or API key:
1. **Immediately revoke it** at the provider's website
2. Generate a new one
3. Update your local `.env` files
4. See [SECURITY.md](SECURITY.md) for detailed incident response procedures

## 🚀 Production Deployment

### With Docker (Recommended)
```bash
# Build for production
docker-compose -f docker-compose.prod.yml up --build -d

# Scale services if needed
docker-compose up -d --scale frontend=3
```

### Environment Variables
Create `.env.local` in the `novel-editor-demo/apps/web` directory:
```
OPENROUTER_API_KEY=your-openrouter-api-key-here
NEXT_PUBLIC_PDF_SERVICE_URL=http://localhost:8000
```

**Note**: The OpenRouter API key is required for AI chat functionality. Get your key from [OpenRouter](https://openrouter.ai/keys). **NEVER commit this file or share the key publicly.**

## 📞 Support

For deployment issues or feature requests, contact the development team.

---

**Built with ❤️ for Social Garden's professional services delivery**
