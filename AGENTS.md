# Agent Guidelines: Saju-MVP (Eighternity)

This repository is a Next.js 14 application using the App Router, TypeScript, and Tailwind CSS. It implements a Saju (Oriental Astrology) fortune-telling engine.

## 🛠 Build & Development

### Core Commands
- **Development**: `npm run dev`
- **Build**: `npm run build`
- **Lint**: `npm run lint`
- **Start**: `npm run start`

### Testing
*Note: A formal test runner (Jest/Vitest) is not yet configured. Logic should be verified by running the development server and checking API outputs or component behavior.*

## 📐 Code Style & Conventions

### 1. Imports
- Use **absolute path aliases** for all imports: `@/*` maps to the root directory.
- Order: React/Next.js built-ins -> External libraries -> Internal components -> Internal logic/utils -> Types/Contracts -> Styles.
- *Example*: `import { ruleEngine } from "@/lib/engine/ruleEngine";`

### 2. Naming Conventions
- **Components**: PascalCase (e.g., `FortuneCard.tsx`).
- **Logic/Utility Files**: camelCase (e.g., `sajuEngine.ts`).
- **Functions & Variables**: camelCase.
- **Types & Interfaces**: PascalCase.
- **Next.js Specials**: Keep standard naming: `page.tsx`, `layout.tsx`, `route.ts`.

### 3. Types & Validation
- **Zod First**: Use Zod for all data schemas. Inferred types are preferred over manual interface definitions.
- **Location**: Define contracts and schemas in `lib/contracts/`.
- *Pattern*:
  ```typescript
  export const UserSchema = z.object({ ... });
  export type User = z.infer<typeof UserSchema>;
  ```
- **Strict Mode**: Maintain `strict: true` in `tsconfig.json`. Avoid `any`.

### 4. Component Structure
- Use functional components with TypeScript.
- **Styling**: Use Tailwind CSS utility classes.
- **Class Merging**: Use `clsx` and `tailwind-merge` (often as a `cn` utility) for conditional classes.
- **Icons**: Use `lucide-react`.

### 5. API Routes (App Router)
- Standardize responses using `NextResponse.json`.
- **Error Handling**: Return clear error messages and appropriate HTTP status codes.
- *Example*: `return NextResponse.json({ error: "Unauthorized" }, { status: 401 });`

### 6. Fortune Engine Logic
- Business logic for Saju calculations resides in `lib/engine/`.
- Constants and rule templates reside in `rules/`.
- Keep calculations deterministic and separated from React component lifecycle.

## 📁 Project Structure
- `app/`: Routing and API endpoints.
- `components/`: UI components.
- `lib/`: Business logic, engines, and Zod contracts.
- `rules/`: JSON-based rule tables and message templates.
- `db/`: Database schemas (PostgreSQL).

## 🚀 Work Protocol
1. **Analyze**: Before modifying logic, check `lib/contracts/` for existing schemas.
2. **Implement**: Follow the "Zod-first" pattern for new data structures.
3. **Verify**: Use `npm run lint` before committing.
4. **No Visual Direct Edits**: Visual styling changes should be handled with care or delegated to specialized UI agents if available.
