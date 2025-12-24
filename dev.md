# STP Alumni Project – Frontend Onboarding & Architecture

## 1. Tech Stack
- **Next.js 16** (App Router)
- **JavaScript** (No TypeScript) - Use JSDoc for complex objects
- **Shadcn/UI & Tailwind** - Use pre-built components: `npx shadcn-ui@latest add [component]`
- **next-intl** - For French/English localization

## 2. French-First Workflow
We code in English for now, but prepare for French translation:
- **Never hardcode strings** - Always use localization
- Store text in `src/messages/en.json`
- Use the `t()` hook for all UI text
- Auto-translation to French will happen later

### Example Localization:
```js
'use client';
import { useTranslations } from 'next-intl';

export default function Hero() {
  const t = useTranslations('Hero'); // 'Hero' matches JSON key
  
  return (
    <section>
      <h1>{t('welcomeMessage')}</h1>
      <button>{t('ctaButton')}</button>
    </section>
  );
}
```

## 3. Folder Structure
Everything must be inside src/app/[locale]/:

src/app/[locale]/
├── (marketing)/      # Landing pages, About, etc.
├── (auth)/          # Login and Registration
├── (portal)/        # Logged-in Alumni dashboard
└── components/
    └── shared/      # Global components (Navbar, Footer)


## 4. Data Handling (Field-Level Localization)
### Reading Data:

```js
// Data from API/DB comes as localized objects
const alumni = {
  name: "Jean Dupont",
  bio: {
    en: "Software Engineer...",
    fr: "Ingénieur logiciel..."
  }
};

// In component:
const locale = useLocale(); // "en" or "fr"
const displayBio = alumni.bio[locale] || alumni.bio['en'];
```
### Writing Data:
- Forms will use a helper for auto-translation via AI

- Focus on form UI; translation logic will be injected


## 5. Navigation
Always use custom routing to preserve locale prefix:

```js
// ✅ CORRECT: Use our custom routing
import { Link, useRouter, usePathname } from '@/i18n/routing';

// Linking
<Link href="/about">About Us</Link>

// Programmatic navigation
const router = useRouter();
router.push('/dashboard');
```

---

```js
// ❌ WRONG: Don't use standard Next.js routing
import Link from 'next/link';
import { useRouter } from 'next/navigation';
```


## 6. First Tasks

- Pull the repository - Initial i18n setup is complete

- Global Styles - Map brand colors from Figma to Tailwind CSS variables in globals.css

- Build Navbar - Use Shadcn components

- LanguageSwitcher component is already included

- Style to match Figma design

### Key Rules Summary

- All pages/components must be inside src/app/[locale]/

- Never hardcode text - always use t() hook

- Always use @/i18n/routing for navigation

- Use Shadcn components instead of building from scratch

- Data from API will have { en: "...", fr: "..." } structure


