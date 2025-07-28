# Shared Package

This package contains shared utilities, types, and configurations used across the AllerScan application.

## Contents

- **Types**: TypeScript type definitions
- **Schemas**: Zod validation schemas
- **Utilities**: Common helper functions
- **OCR**: Image processing and text extraction utilities
- **Matching**: Allergen matching algorithms

## Usage

```typescript
import { AllergenMatch, MatchReport } from '@allerscan/shared';
import { ocrService } from '@allerscan/shared/ocr';
```

## Development

```bash
# Build the package
pnpm build

# Watch for changes
pnpm dev

# Run tests
pnpm test
```