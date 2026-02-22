# lukaswoellhafcom 👨‍💻

Personal portfolio website with minimal design and internationalization (EN/DE) support.

## Tech Stack

- React 18 + TypeScript
- Vite
- React Router
- CSS Modules

## Setup

### Run Application

```bash
npm install
npm run dev
```

### Pre-Commit Hooks

```bash
pre-commit install              # Install necessary pre-commit hooks
pre-commit run --all-files      # Validate all pre-commits are active
```

## Key Commands

```bash
npm run dev                     # Start dev server
npm run build                   # Build for production
npm run lint                    # Run ESLint
npm run type-check              # Run TypeScript compiler
npm test                        # Run tests
npm run validate-content        # Validate content JSON files
```

## Project Structure

- `src/content/` - JSON content files (profile, experience, skills, education, certifications, interests)
  - All content has `-en.json` and `-de.json` versions
- `src/content/projects/` - Project markdown files with frontmatter
- `src/i18n/` - Translation files (en.json, de.json)
- `src/components/` - React components
- `src/pages/` - Page components
- `tests/` - Test files

## Content Management

All content is stored in JSON files with language-specific versions. To add new content, create/edit files in `src/content/` following the existing structure.

Project details are written in Markdown files in `src/content/projects/` with YAML frontmatter.

## Feature Flags

Control section visibility in `src/config/features.ts`:

```typescript
export const featureFlags = {
  sections: {
    about: true,           // Profile header + work/skills/education/certs
    workExperience: true,  // Work experience subsection
    skills: true,          // Skills subsection
    education: true,       // Education subsection
    certifications: true,  // Certifications subsection
    personal: true,        // Personal interests section
    projects: true,        // Projects section
    contact: true,         // Contact section (footer)
  },
  routes: {
    projectDetail: true,   // Individual project detail pages
  },
};
```

Set any to `false` to hide that section/route.
