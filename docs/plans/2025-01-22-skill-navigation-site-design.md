# Agent Skill Navigation Site Design

**Date:** 2025-01-22
**Status:** Approved
**Author:** Blake + Claude

## Overview

A static navigation site for discovering and exploring Claude Code agent skills. Similar to MCP navigation sites, this platform helps end users (non-technical) find useful skills without requiring coding knowledge.

## Target Audience

- **Primary:** End users (non-technical) looking for ready-to-use skills
- **Secondary:** Developers who want to discover existing skills

## Core Features (MVP)

1. Browse, search, and filter skills
2. Category-based navigation
3. Skill detail pages with screenshots and examples
4. Responsive design for all devices
5. Dark mode support

## Architecture: Option A - Pure Static

**Tech Stack:**
- Next.js 15 (App Router) + TypeScript
- Tailwind CSS + shadcn/ui components
- Client-side search with fuse.js
- JSON data files
- GitHub Pages hosting

### Project Structure

```
skill-nav/
├── src/
│   ├── app/                      # Next.js App Router pages
│   │   ├── page.tsx             # Home page
│   │   ├── browse/              # Browse page with filters
│   │   └── skill/
│   │       └── [id]/            # Skill detail pages
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── SkillCard.tsx
│   │   ├── skills/
│   │   │   ├── SkillGrid.tsx
│   │   │   ├── SkillDetail.tsx
│   │   │   ├── CategoryFilter.tsx
│   │   │   └── SearchBar.tsx
│   │   └── home/
│   │       └── Hero.tsx
│   ├── lib/
│   │   ├── utils.ts
│   │   ├── search.ts           # fuse.js integration
│   │   └── validation.ts       # Zod schemas
│   └── data/                    # Generated from skills/
├── public/
│   └── images/                  # Skill screenshots
└── skills/                      # ✨ Source of truth
    ├── categories.json
    ├── skills/
    │   ├── frontend-design.json
    │   ├── code-review.json
    │   └── ...
    └── index.json
```

## Data Models

### Skill Schema

```json
{
  "id": "frontend-design",
  "name": "Frontend Design",
  "description": "Create production-grade frontend interfaces with high design quality",
  "category": "implementation",
  "author": "superpowers",
  "repository": "https://github.com/...",
  "version": "1.0.0",
  "tags": ["frontend", "ui", "design", "web"],
  "addedDate": "2025-01-15",
  "featured": true,
  "screenshot": "/images/skills/frontend-design.png",
  "usageExample": "Use this skill when the user asks to build web components, pages, or applications.",
  "compatibility": {
    "claudeCode": ">=1.0.0",
    "requires": []
  }
}
```

### Categories Schema

```json
{
  "process": {
    "name": "Process Skills",
    "description": "Skills that guide how to approach and execute tasks",
    "icon": "workflow"
  },
  "implementation": {
    "name": "Implementation Skills",
    "description": "Skills for building specific features or components",
    "icon": "code"
  }
}
```

## Page Structure

### 1. Home Page (`/`)
- Hero section with site description and search CTA
- Featured skills (3-6 highlighted skills)
- Browse by category section
- Recent additions

### 2. Browse Page (`/browse`)
- Left sidebar: Category filters + tag cloud
- Main area: Search bar + sortable skill grid
- URL params for state: `/browse?category=implementation&sort=popular`

### 3. Skill Detail Page (`/skill/[id]`)
- Full skill metadata
- Screenshot/gallery
- Usage examples
- Installation instructions
- Related skills
- "Get this skill" CTA linking to repo

## Key UX Patterns

- **Client-side search**: fuse.js for instant results without page reload
- **Category navigation**: Pills with counts (e.g., "Implementation (12)")
- **Sort options**: Popular, Recent, A-Z
- **Responsive grid**: 1→2→3 columns based on viewport
- **Dark mode**: System preference + manual toggle

## Content Strategy

**Phase 1 (Launch):**
- Curated collection maintained by site owner
- ~20-30 high-quality skills
- Quality control over quantity

**Phase 2 (Growth):**
- Community submissions with approval workflow
- User ratings and reviews
- Analytics tracking

## Build Pipeline

1. `npm run dev` - Local development with hot reload
2. `npm run build` - Static HTML generation
3. `npm run export` - Export to out/ directory
4. Deploy to GitHub Pages via `gh-pages` branch

**Data Validation:**
- Build-time Zod schema validation
- Fail-fast on invalid JSON
- Detailed error messages for missing fields

## Migration Path to Dynamic

When ready for community submissions:

1. Add Next.js API routes (`/api/submit`, `/api/approve`)
2. Integrate database (Supabase/PostgreSQL)
3. Build admin approval queue UI
4. Store approved submissions in database
5. Periodically write approved skills back to JSON files
6. Keep static generation for performance

**Benefits:**
- No frontend rewrites needed
- Maintain static site performance
- Git-based workflow remains as backup
- Can revert to static-only if needed

## Success Criteria

- [ ] Launch with 20+ curated skills
- [ ] Page load time < 2s on 3G
- [ ] Mobile-friendly responsive design
- [ ] Dark mode support
- [ ] SEO-friendly with metadata
- [ ] Search works instantly (< 100ms)
- [ ] Easy to add new skills (just JSON file)

## Future Enhancements (Out of Scope for MVP)

- User accounts and favorites
- Community submissions and moderation
- Usage analytics and popularity tracking
- Skill comparison tool
- Newsletter signup
- Multi-language support
