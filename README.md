# 🚀 CRM Frontend Application

<div align="center">

![React](https://img.shields.io/badge/React-19.1.1-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.1.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4.1.13-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)

A modern and responsive CRM application built with cutting-edge technologies, offering an exceptional user experience with complete internationalization support.

[🚀 Quick Start](#-quick-start-with-docker) • [💻 Development](#-local-development) • [📖 Documentation](#-documentation) • [🤝 Contributing](#-contributing)

</div>

---

## ✨ Features

### 🎯 **Core Features**
- 📊 **Complete Lead Management** - Intuitive interface for creating, editing and tracking leads
- 🎯 **Opportunity Management** - Visual pipeline for sales control
- 🌍 **Internationalization (i18n)** - Native support for Portuguese and English
- 📱 **Responsive Design** - Adaptable interface for desktop, tablet and mobile
- ⚡ **Optimized Performance** - Fast loading with Vite and React 19

### 🛠️ **Technical Features**
- 🔒 **TypeScript** - Static typing for greater reliability
- 🎨 **Tailwind CSS** - Modern and consistent styling
- 🔄 **Global State** - Efficient management with Context API
- 💾 **Local Persistence** - Data automatically saved to localStorage
- 🧪 **Modular Architecture** - Reusable and scalable components

---

## 🚀 Quick Start with Docker

### 📋 **Prerequisites**
- [Docker](https://www.docker.com/get-started) installed
- [Git](https://git-scm.com/) installed

### ⚡ **Running in 30 seconds**

```bash
# 1. Clone the repository
git clone https://github.com/FelipeDylanMar/HW-Challange.git
cd HW-Challange

# 2. Run with Docker (single command!)
docker compose up --build -d
```

🎉 **Done!** The application will be running at: **http://localhost:3000**

### 🐳 **Useful Docker Commands**

```bash
# Stop the application
docker compose down

# View logs in real time
docker compose logs -f

# Complete rebuild (after code changes)
docker compose down && docker compose up --build -d

# Check container status
docker ps
```

---

## 💻 Local Development

### 📋 **Prerequisites**
- [Node.js](https://nodejs.org/) 18.0.0 or higher
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### 🔧 **Installation and Setup**

```bash
# 1. Clone the repository
git clone https://github.com/FelipeDylanMar/HW-Challange.git
cd HW-Challange

# 2. Install dependencies
npm install

# 3. Run in development mode
npm run dev
```

The application will be available at: **http://localhost:5173**

### 📝 **Available Scripts**

| Command | Description |
|---------|-------------|
| `npm run dev` | 🚀 Start development server with hot reload |
| `npm run build` | 📦 Create optimized production build |
| `npm run preview` | 👀 Preview production build locally |
| `npm run lint` | 🔍 Run code verification with ESLint |

---

## 🛠️ Technology Stack

### **Frontend Core**
- **[React 19.1.1](https://react.dev/)** - User interface library
- **[TypeScript 5.8.3](https://www.typescriptlang.org/)** - Typed superset of JavaScript
- **[Vite 7.1.2](https://vitejs.dev/)** - Modern and ultra-fast build tool

### **Styling & UI**
- **[Tailwind CSS 4.1.13](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Lucide React](https://lucide.dev/)** - Modern icon library
- **Design System** - Consistent and reusable components

### **Routing & State**
- **[React Router DOM 7.9.1](https://reactrouter.com/)** - Routing for SPAs
- **[Context API](https://react.dev/reference/react/useContext)** - Global state management

### **Internationalization**
- **[React i18next 15.7.3](https://react.i18next.com/)** - Internationalization framework
- **[i18next 25.5.2](https://www.i18next.com/)** - Internationalization core
- **Language Detection** - Automatic browser language detection

### **DevOps & Deployment**
- **[Docker](https://www.docker.com/)** - Containerization
- **[Nginx](https://nginx.org/)** - Web server for production
- **Multi-stage Build** - Docker image optimization

---

## 📁 Project Structure

```
HW-Challange/
├── 📁 public/                  # Public assets
├── 📁 src/
│   ├── 📁 components/          # Reusable components
│   │   ├── 📁 Leads/          # Lead-specific components
│   │   ├── 📁 Opportunities/  # Opportunity components
│   │   ├── 📁 UI/             # UI components
│   │   └── 📄 index.ts        # Barrel exports
│   ├── 📁 context/            # React contexts (global state)
│   ├── 📁 hooks/              # Custom hooks
│   ├── 📁 i18n/               # Internationalization setup
│   │   └── 📁 locales/        # Translation files
│   ├── 📁 pages/              # Application pages
│   ├── 📁 types/              # TypeScript definitions
│   ├── 📁 utils/              # Utility functions
│   ├── 📁 assets/             # Assets and mock data
│   └── 📄 main.tsx            # Application entry point
├── 📄 Dockerfile              # Docker configuration
├── 📄 docker-compose.yml      # Docker orchestration
├── 📄 nginx.conf              # Nginx configuration
└── 📄 package.json            # Dependencies and scripts
```

---

## 🌐 Internationalization

### **Supported Languages**
- 🇧🇷 **Portuguese** (pt) - Default language
- 🇺🇸 **English** (en) - Alternative language

### **i18n Features**
- ✅ Automatic browser language detection
- ✅ Real-time language switching
- ✅ User preference persistence
- ✅ Regional date and number formatting
- ✅ Completely translated interface texts

### **Adding New Languages**

1. Create a new file in `src/i18n/locales/`
2. Add translations following the existing structure
3. Register the language in `src/i18n/index.ts`

```typescript
// Example: src/i18n/locales/es.json
{
  "common": {
    "save": "Guardar",
    "cancel": "Cancelar"
  }
}
```

---

## 🎨 Development Guide

### **Code Conventions**
- 📝 **Components**: PascalCase (`LeadForm.tsx`)
- 📝 **Hooks**: camelCase with `use` prefix (`useLeads.ts`)
- 📝 **Utilities**: camelCase (`formatDate.ts`)
- 📝 **Types**: PascalCase (`Lead`, `Opportunity`)

### **Component Structure**
```typescript
// Example of well-structured component
interface ComponentProps {
  // Typed props
}

export const Component: React.FC<ComponentProps> = ({ prop }) => {
  // Hooks
  // Local state
  // Helper functions
  // Render
  return <div>...</div>;
};
```

### **State Management**
- **Local State**: `useState` for component-specific data
- **Global State**: Context API for shared data
- **Persistence**: localStorage for data that should persist

---

## 🔧 Advanced Configuration

### **Environment Variables**
```bash
# .env.local (optional)
VITE_API_URL=http://localhost:3001
VITE_APP_TITLE=CRM Application
```

### **ESLint Configuration**
```javascript
// eslint.config.js
export default tseslint.config([
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      ...tseslint.configs.recommendedTypeChecked,
      ...tseslint.configs.strictTypeChecked,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
]);
```

---

## 🚀 Production Deployment

### **Option 1: Docker (Recommended)**
```bash
# Build and deploy with Docker
docker compose up --build -d
```

### **Option 2: Manual Build**
```bash
# Generate production build
npm run build

# Serve with web server (nginx, apache, etc.)
# Files will be in the 'dist/' folder
```

### **Option 3: Cloud Platforms**
- **Vercel**: Automatic deployment via Git
- **Netlify**: Continuous integration
- **AWS S3 + CloudFront**: Static hosting

---

## 🧪 Testing and Quality

### **Code Verification**
```bash
# Code linting
npm run lint

# TypeScript type checking
npx tsc --noEmit
```

### **Performance Metrics**
- ⚡ **First Contentful Paint**: < 1.5s
- ⚡ **Largest Contentful Paint**: < 2.5s
- ⚡ **Bundle Size**: Optimized with tree-shaking

---

## 🤝 Contributing

### **How to Contribute**

1. **Fork** the project
2. **Clone** your fork: `git clone https://github.com/your-username/HW-Challange.git`
3. **Create** a branch: `git checkout -b feature/new-feature`
4. **Make** your changes
5. **Test** locally: `npm run dev`
6. **Commit**: `git commit -m 'feat: add new feature'`
7. **Push**: `git push origin feature/new-feature`
8. **Open** a Pull Request

### **Commit Standards**
```
feat: new feature
fix: bug fix
docs: documentation update
style: code formatting
refactor: refactoring
test: adding tests
chore: maintenance tasks
```

---

## 📞 Support

### **Common Issues**

<details>
<summary>🐳 Docker not working</summary>

1. Check if Docker is installed: `docker --version`
2. Make sure Docker Desktop is running
3. Try: `docker compose down && docker compose up --build -d`
</details>

<details>
<summary>📦 Dependency errors</summary>

1. Clear cache: `npm cache clean --force`
2. Delete node_modules: `rm -rf node_modules`
3. Reinstall: `npm install`
</details>

<details>
<summary>🌐 i18n issues</summary>

1. Check if translation files are in `src/i18n/locales/`
2. Confirm the language is registered in `src/i18n/index.ts`
3. Clear localStorage: `localStorage.clear()`
</details>

### **Contact**
- 📧 **Email**: [felipe@example.com](mailto:felipe.back98@gmail.com)
- 🐙 **GitHub**: [@FelipeDylanMar](https://github.com/FelipeDylanMar)
- 💼 **LinkedIn**: [Felipe Dylan](https://linkedin.com/in/felipe-dylan)

---

## 📄 License

This project is under the MIT license. See the [LICENSE](LICENSE) file for more details.

---

<div align="center">


Made with ❤️ by [Felipe Dylan](https://github.com/FelipeDylanMar)

</div>
