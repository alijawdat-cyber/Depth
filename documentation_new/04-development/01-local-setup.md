# 🔧 Local Development Setup

## Prerequisites
- **Node.js**: v20.0.0 or higher
- **npm**: v10.0.0 or higher
- **Git**: Latest version
- **Firebase CLI**: Latest version

## Installation Steps

### 1. Clone the Repository
```bash
git clone https://github.com/alijawdat-cyber/Depth.git
cd Depth
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Install Firebase CLI
```bash
npm install -g firebase-tools
firebase login
```

### 4. Environment Setup
```bash
# Copy environment template
cp .env.example .env.local

# Edit environment variables
nano .env.local
```

### 5. Firebase Project Setup
```bash
# Initialize Firebase
firebase init

# Select:
# - Firestore
# - Functions  
# - Hosting
# - Storage
# - Emulators
```

### 6. Start Development Server
```bash
npm run dev
```

## Development Workflow

### Daily Workflow
1. Pull latest changes: `git pull`
2. Install new dependencies: `npm install`
3. Start dev server: `npm run dev`
4. Make changes
5. Test: `npm test`
6. Commit: `git commit -m "feat: description"`
7. Push: `git push`

### Testing Locally
```bash
# Run all tests
npm test

# Run specific test
npm test -- --testNamePattern="Creator"

# Run with coverage
npm run test:coverage
```

### Database Development
```bash
# Start Firebase emulators
npm run firebase:emulators

# Seed initial data
npm run db:seed

# Reset database
npm run db:reset
```

## IDE Setup (VS Code)

### Required Extensions
- Firebase
- Prettier - Code formatter
- ESLint
- Tailwind CSS IntelliSense
- TypeScript Hero
- Thunder Client (API testing)

### VS Code Settings
Create `.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.preferences.importModuleSpecifier": "relative",
  "files.associations": {
    "*.css": "tailwindcss"
  }
}
```

## Troubleshooting

### Common Issues
1. **Port 3000 in use**: Change port in `package.json`
2. **Firebase permission denied**: Run `firebase login --reauth`
3. **Module not found**: Delete `node_modules` and run `npm install`
4. **TypeScript errors**: Run `npm run type-check`

### Environment Issues
```bash
# Clear npm cache
npm cache clean --force

# Reset node_modules
rm -rf node_modules package-lock.json
npm install

# Reset Firebase
firebase logout
firebase login
```
