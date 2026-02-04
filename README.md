# Rick & Morty Comparator

![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?logo=next.js)
![React](https://img.shields.io/badge/React-19.2.3-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Vitest](https://img.shields.io/badge/Vitest-4.0-6E9F18?logo=vitest)
![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8?logo=pwa)
![Tailwind](https://img.shields.io/badge/Tailwind-4.0-38B2AC?logo=tailwindcss)

**Dashboard de comparación de personajes con análisis de intersección de episodios.**

Selecciona dos personajes de Rick & Morty y descubre qué episodios comparten, cuáles son exclusivos de cada uno, y exporta los resultados para análisis posterior.

---

## 🚀 Live Demo

👉 **[https://conexa-challenge-one.vercel.app](https://conexa-challenge-one.vercel.app)**

---

## ✨ Key Features

### 📱 Progressive Web App (PWA)
Instalable en iOS/Android directamente desde el navegador. Accede desde tu home screen con experiencia nativa.

### ⚡ Smart Comparison Engine
Algoritmo optimizado basado en Set Theory para calcular intersecciones y diferencias de episodios. Evita el problema N+1 queries con bulk fetching inteligente.

### 🔗 URL State Sync
Cada comparación genera una URL única (`?charA=1&charB=2`). Comparte links directos para colaboración instantánea.

### 📊 Data Export
Descarga los resultados de comparación en formato CSV para análisis en Excel, Google Sheets o cualquier herramienta de BI.

### 📐 Mobile-First Dashboard
Layout adaptativo con viewport fijo (60/40 split). Indicadores visuales de scroll y estados de carga optimizados.

---

## 🛠️ Tech Stack (2026 Ready)

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 16 (App Router + Turbopack) |
| **UI Library** | React 19 |
| **Styling** | Tailwind CSS v4 + shadcn/ui |
| **State Management** | Zustand + nuqs (URL state) |
| **Data Fetching** | TanStack Query v5 |
| **Validation** | Zod v4 |
| **Testing** | Vitest + React Testing Library |
| **Error Handling** | react-error-boundary |

---

## 🏗️ Architecture

### Feature-Sliced Design (FSD)

El proyecto sigue una arquitectura modular organizada por features:

```
src/
├── app/                    # Next.js App Router
├── features/
│   ├── characters/         # Character selection & search
│   │   ├── components/
│   │   └── hooks/
│   └── episodes/           # Episode comparison logic
│       ├── components/
│       ├── hooks/
│       └── utils/
├── components/
│   ├── layout/             # Layout components
│   └── ui/                 # shadcn/ui components
├── lib/                    # Utilities & adapters
├── schemas/                # Zod validation schemas
├── store/                  # Zustand stores
└── hooks/                  # Shared hooks
```

### Adapter Pattern

La capa `lib/adapters.ts` normaliza las respuestas de la Rick & Morty API, manejando el "single object trap" (cuando la API retorna un objeto en lugar de array para un solo resultado).

```typescript
// Normaliza respuestas: objeto → array
export function normalizeEpisodeResponse(data: unknown): Episode[]
```

---

## 🚦 Getting Started

### Prerequisites

- Node.js 20+
- npm 10+

### Installation

```bash
# Clone the repository
git clone https://github.com/tomigarbarino/conexa-challenge.git
cd conexa-challenge

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run test` | Run tests in watch mode |
| `npm run test:run` | Run tests once |
| `npm run test:coverage` | Run tests with coverage |
| `npm run lint` | Run ESLint |

---

## 🧪 Testing

El proyecto incluye **43 tests** cubriendo:

- **Unit Tests:** Set operations, API adapters, Zod schemas
- **Integration Tests:** useEpisodeComparison hook con axios mocking

```bash
# Run all tests
npm run test:run

# Run with coverage
npm run test:coverage
```

---

## 📝 API Reference

Este proyecto consume la [Rick and Morty API](https://rickandmortyapi.com/):

- `GET /character?name={query}` - Búsqueda de personajes
- `GET /episode/{ids}` - Bulk fetch de episodios

---

## 📄 License

MIT © 2026

---

<p align="center">
  Built with ☕ for the Conexa Challenge
</p>
