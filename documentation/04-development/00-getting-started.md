# 🚀 Getting Started - Depth Platform v2.0

## Prerequisites
- Node.js v20+
- Firebase CLI
- Git

## Quick Start
1. Clone the repository
2. Install dependencies: `npm install`
3. Setup environment: `cp .env.example .env`
4. Run locally: `npm run dev`

## Next Steps
- [Local Setup](./01-local-setup.md)
- [Environment Variables](./02-environment-variables.md)
- [Development Workflow](./03-development-workflow.md)

## Project Structure
```
depth-platform-v2/
├── src/
│   ├── app/                 # Next.js App Router
│   ├── components/          # React Components
│   ├── lib/                 # Utilities & Services
│   ├── hooks/               # Custom Hooks
│   └── types/               # TypeScript Types
├── public/                  # Static Assets
├── docs/                    # Documentation
└── tests/                   # Test Files
```

## Development Commands
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run test         # Run tests
npm run lint         # Run linting
npm run type-check   # TypeScript checking
```

## Getting Help
- [API Documentation](../03-api/)
- [Database Schema](../02-database/00-data-dictionary.md)
- [Project Requirements](../01-requirements/00-01-requirements/00-requirements-v2.0.md)
