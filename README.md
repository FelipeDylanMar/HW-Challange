# CRM Frontend Application

Uma aplicação CRM moderna construída com React, TypeScript, Vite e Tailwind CSS, com suporte completo à internacionalização (i18n).

## 🚀 Funcionalidades

- **Interface moderna**: Design responsivo com Tailwind CSS
- **Internacionalização**: Suporte completo a múltiplos idiomas (PT/EN)
- **TypeScript**: Tipagem estática para maior confiabilidade
- **Gestão de Leads**: Interface para gerenciamento de leads e oportunidades
- **Componentes reutilizáveis**: Arquitetura modular e escalável

## 🐳 Execução com Docker (Recomendado)

A forma mais simples de executar o projeto é usando Docker:

```bash
# Clone o repositório
git clone <repository-url>
cd HW-Challange

# Execute com Docker Compose
docker compose up --build -d
```

A aplicação estará disponível em: http://localhost:3000

### Comandos Docker úteis:

```bash
# Parar os containers
docker compose down

# Ver logs
docker compose logs -f

# Rebuild completo
docker compose down && docker compose up --build -d
```

## 💻 Desenvolvimento Local

### Pré-requisitos

- Node.js 18+ 
- npm ou yarn

### Instalação

```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

## 🛠️ Tecnologias Utilizadas

- **React 18** - Biblioteca para interfaces de usuário
- **TypeScript** - Superset do JavaScript com tipagem estática
- **Vite** - Build tool moderna e rápida
- **Tailwind CSS** - Framework CSS utilitário
- **React Router** - Roteamento para SPAs
- **React i18next** - Internacionalização
- **Lucide React** - Ícones modernos

## 📁 Estrutura do Projeto

```
src/
├── components/     # Componentes reutilizáveis
├── pages/         # Páginas da aplicação
├── hooks/         # Custom hooks
├── contexts/      # Contextos React
├── assets/        # Assets estáticos e dados mock
├── locales/       # Arquivos de tradução
└── types/         # Definições TypeScript
```

## 🌐 Internacionalização

O projeto suporta múltiplos idiomas:
- Português (pt)
- Inglês (en)

Para adicionar novos idiomas, edite os arquivos em `src/locales/`.

## 🔧 Configuração do ESLint

Se você está desenvolvendo uma aplicação para produção, recomendamos atualizar a configuração para habilitar regras de lint com verificação de tipos:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      ...tseslint.configs.recommendedTypeChecked,
      ...tseslint.configs.strictTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
])
```

## 📝 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria o build de produção
- `npm run preview` - Visualiza o build de produção
- `npm run lint` - Executa o ESLint

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request
