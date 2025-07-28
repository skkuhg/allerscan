# AllerScan

A comprehensive food allergen detection app that helps users identify potential allergens in food products through image scanning and text analysis.

## Features

- 📱 **Web Application**: Modern React-based frontend with Next.js 14
- 🔍 **Image Scanning**: OCR capabilities using Tesseract.js for text extraction from food labels
- 🧠 **NLP Processing**: Flask microservice for advanced natural language processing
- 🤖 **AI Research**: Tavily AI integration for real-time allergen research and safety information
- 📊 **User Management**: Secure authentication and personalized allergen profiles
- 🔒 **Data Security**: JWT-based authentication with encrypted user data

## Tech Stack

### Frontend (apps/web)
- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation
- **OCR**: Tesseract.js
- **Animations**: Framer Motion

### Backend (apps/api)
- **Runtime**: Node.js with Express
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with bcrypt
- **Email**: Nodemailer
- **AI Research**: Tavily AI API integration

### Shared (packages/shared)
- **Types**: TypeScript definitions
- **Validation**: Zod schemas
- **Utilities**: Common helper functions

### NLP Service (services/flask-nlp)
- **Framework**: Flask (Python)
- **Purpose**: Advanced text processing and allergen detection

## Project Structure

```
allerscan/
├── apps/
│   ├── web/          # Next.js frontend
│   └── api/          # Express backend
├── packages/
│   └── shared/       # Shared types and utilities
├── services/
│   └── flask-nlp/    # Flask NLP microservice
├── package.json      # Root package.json with workspaces
├── tsconfig.json     # TypeScript configuration
└── README.md         # This file
```

## Getting Started

### Prerequisites

- Node.js 18.17.0 or higher
- pnpm 8.0.0 or higher
- PostgreSQL database
- Python 3.8+ (for NLP service)

### Installation

1. Install dependencies:
```bash
pnpm install
```

2. Set up environment variables:
   - Copy `.env.example` files to `.env` in each service
   - Configure database connections and API keys

3. Start development servers:
```bash
pnpm dev
```

### Scripts

- `pnpm dev` - Start all development servers
- `pnpm build` - Build all applications
- `pnpm test` - Run all tests
- `pnpm lint` - Lint all code
- `pnpm format` - Format code with Prettier

## Environment Variables

Each service has its own environment configuration:
- `apps/web/.env.local` - Frontend environment variables
- `apps/api/.env` - Backend environment variables
- `services/flask-nlp/.env` - Flask service environment variables

### Required API Keys

- **Tavily AI API Key**: Get your free API key from [tavily.com](https://tavily.com) for real-time allergen research
- **Database URL**: PostgreSQL connection string
- **JWT Secret**: Secure secret for token signing
- **SMTP Credentials**: For email functionality

See individual `.env.example` files for required variables.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.