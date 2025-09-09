# Plataforma de Inovação Aberta

Uma plataforma web moderna para conectar corporações e startups, facilitando a gestão de desafios de inovação, captação de ideias e colaboração estruturada.

## 🚀 Tecnologias

- **Next.js 15** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS v4** - Framework CSS utilitário
- **Shadcn/ui** - Componentes de interface
- **Recharts** - Visualização de dados
- **Lucide React** - Ícones

## 📁 Estrutura do Projeto

```
├── app/                      # App Router do Next.js
│   ├── layout.tsx           # Layout principal
│   ├── page.tsx             # Página inicial (Login)
│   ├── loading.tsx          # Página de carregamento
│   ├── not-found.tsx        # Página 404
│   ├── context/             # Contextos React
│   │   └── UserContext.tsx  # Gerenciamento de usuário
│   ├── dashboard/           # Dashboard principal
│   │   └── page.tsx
│   ├── challenges/          # Gestão de desafios
│   │   ├── new/
│   │   │   └── page.tsx     # Novo desafio
│   │   └── [id]/
│   │       └── page.tsx     # Detalhes do desafio
│   └── startups/            # Base de startups
│       └── page.tsx
├── components/              # Componentes reutilizáveis
│   ├── ui/                  # Componentes Shadcn/ui
│   ├── Dashboard.tsx        # Dashboard principal
│   ├── Login.tsx            # Tela de login
│   ├── ChallengeForm.tsx    # Formulário de desafios
│   ├── ChallengeDetails.tsx # Detalhes do desafio
│   └── StartupDatabase.tsx  # Base de startups
└── styles/
    └── globals.css          # Estilos globais Tailwind
```

## 🎯 Funcionalidades

### Autenticação e Perfis
- **3 níveis de acesso**: Usuário comum, Avaliador, Gestor de Inovação
- **Login rápido** para demonstração
- **Persistência de sessão** com localStorage

### Dashboard de Gestão
- **KPIs visuais** com gráficos interativos
- **Funil de inovação** em formato kanban
- **Filtro por empresa** (plataforma multiempresa)
- **Métricas de desempenho** em tempo real

### Gestão de Desafios
- **Formulário completo** de cadastro
- **Sistema de tags** dinâmico
- **Configuração de publicação** (interno/público)
- **Calendário integrado** para datas

### Base de Startups
- **Busca avançada** com múltiplos filtros
- **Visualização flexível** (grade/lista)
- **Perfis detalhados** das startups
- **Categorização por estágio** e segmento

### Conectividade e Workflow
- **Recomendações automáticas** baseadas em IA
- **Sistema de matching** com score de compatibilidade
- **Workflow de conexão** estruturado
- **Gestão de POCs** (Provas de Conceito)

## 🛠️ Instalação e Uso

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Executar em produção
npm start
```

## 🎨 Design System

A aplicação utiliza um design system moderno com:

- **Cores consistentes** através de CSS variables
- **Tipografia padronizada** com hierarquia clara
- **Componentes reutilizáveis** do Shadcn/ui
- **Responsividade** para desktop e mobile
- **Modo escuro** suportado

## 📊 Dados Mock

Para demonstração, a plataforma inclui:
- **Startups fictícias** com dados realistas
- **Desafios de exemplo** em diferentes segmentos
- **Métricas simuladas** para KPIs
- **Histórico de interações** mockado

## 🔐 Segurança e Privacidade

- **Áreas restritas** por empresa
- **Controle de acesso** baseado em perfis
- **Dados segmentados** por organização
- **Não coleta PII** em ambiente de demonstração

## 📱 Responsividade

A plataforma é totalmente responsiva e otimizada para:
- **Desktop** (1024px+)
- **Tablet** (768px-1023px)  
- **Mobile** (320px-767px)

## 🚀 Deploy

A aplicação pode ser facilmente deployada em:
- **Vercel** (recomendado para Next.js)
- **Netlify**
- **AWS Amplify**
- **Docker** containers

## 📄 Licença

Este projeto é uma demonstração de conceito para plataformas de inovação corporativa.