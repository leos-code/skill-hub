# Skill Navigation Site Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a static Next.js website to help end users discover and explore Claude Code agent skills

**Architecture:** Static site generation with JSON data source, client-side search with fuse.js, deployed to GitHub Pages

**Tech Stack:** Next.js 15 (App Router), TypeScript, Tailwind CSS, shadcn/ui, fuse.js, Zod

---

## Task 1: Initialize Next.js Project

**Files:**
- Create: `package.json`
- Create: `next.config.js`
- Create: `tsconfig.json`
- Create: `tailwind.config.ts`
- Create: `postcss.config.js`

**Step 1: Create package.json**

```bash
npm create next-app@latest . --typescript --tailwind --app --no-src-dir --import-alias "@/*" --yes
```

Expected: Next.js project initialized in current directory

**Step 2: Install additional dependencies**

```bash
npm install fuse.js clsx tailwind-merge zod
npm install -D @types/node
```

Expected: Dependencies installed successfully

**Step 3: Configure static export in next.config.js**

Create `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
}

module.exports = nextConfig
```

**Step 4: Update package.json scripts**

Modify `package.json` scripts section:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "export": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

**Step 5: Commit**

```bash
git add package.json next.config.js tsconfig.json tailwind.config.ts postcss.config.js
git commit -m "feat: initialize Next.js project with TypeScript and Tailwind

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 2: Set up shadcn/ui

**Files:**
- Create: `components.json`
- Create: `app/globals.css`
- Create: `lib/utils.ts`
- Create: `components/ui/button.tsx`
- Create: `components/ui/card.tsx`
- Create: `components/ui/input.tsx`
- Create: `components/ui/badge.tsx`

**Step 1: Initialize shadcn/ui**

```bash
npx shadcn@latest init -y -d
```

Expected: shadcn/ui initialized with defaults

**Step 2: Add required components**

```bash
npx shadcn@latest add button card input badge --yes
```

Expected: Components added to `components/ui/`

**Step 3: Verify lib/utils.ts exists**

Check that `lib/utils.ts` contains:

```typescript
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

**Step 4: Commit**

```bash
git add components.json components/ui lib/app/globals.css
git commit -m "feat: add shadcn/ui components

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 3: Create Data Structure and Schemas

**Files:**
- Create: `skills/categories.json`
- Create: `skills/skills/.gitkeep`
- Create: `skills/index.json`
- Create: `lib/schemas.ts`
- Create: `lib/data.ts`

**Step 1: Create categories.json**

Create `skills/categories.json`:

```json
{
  "process": {
    "id": "process",
    "name": "Process Skills",
    "description": "Skills that guide how to approach and execute tasks",
    "icon": "workflow"
  },
  "implementation": {
    "id": "implementation",
    "name": "Implementation Skills",
    "description": "Skills for building specific features or components",
    "icon": "code"
  },
  "development": {
    "id": "development",
    "name": "Development Tools",
    "description": "Skills for development workflows and automation",
    "icon": "tool"
  }
}
```

**Step 2: Create Zod schemas in lib/schemas.ts**

Create `lib/schemas.ts`:

```typescript
import { z } from 'zod'

export const CompatibilitySchema = z.object({
  claudeCode: z.string(),
  requires: z.array(z.string()),
})

export const SkillSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  category: z.string().min(1),
  author: z.string().min(1),
  repository: z.string().url(),
  version: z.string(),
  tags: z.array(z.string()),
  addedDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  featured: z.boolean().default(false),
  screenshot: z.string().optional(),
  usageExample: z.string().optional(),
  compatibility: CompatibilitySchema.optional(),
})

export const CategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  icon: z.string(),
})

export type Skill = z.infer<typeof SkillSchema>
export type Category = z.infer<typeof CategorySchema>
```

**Step 3: Create data loader in lib/data.ts**

Create `lib/data.ts`:

```typescript
import fs from 'fs'
import path from 'path'
import { SkillSchema, CategorySchema, type Skill, type Category } from './schemas'

const skillsDir = path.join(process.cwd(), 'skills')
const skillsFileDir = path.join(skillsDir, 'skills')

export function getCategories(): Category[] {
  const fullPath = path.join(skillsDir, 'categories.json')
  const content = fs.readFileSync(fullPath, 'utf8')
  const data = JSON.parse(content)

  return Object.entries(data).map(([id, cat]: [string, any]) => ({
    ...cat,
    id,
  }))
}

export function getSkills(): Skill[] {
  const files = fs.readdirSync(skillsFileDir)
  const skills: Skill[] = []

  for (const file of files) {
    if (file.endsWith('.json')) {
      const fullPath = path.join(skillsFileDir, file)
      const content = fs.readFileSync(fullPath, 'utf8')
      const data = JSON.parse(content)

      const validated = SkillSchema.parse(data)
      skills.push(validated)
    }
  }

  return skills.sort((a, b) => a.name.localeCompare(b.name))
}

export function getSkillById(id: string): Skill | undefined {
  const skills = getSkills()
  return skills.find(skill => skill.id === id)
}

export function getFeaturedSkills(): Skill[] {
  const skills = getSkills()
  return skills.filter(skill => skill.featured)
}

export function getSkillsByCategory(categoryId: string): Skill[] {
  const skills = getSkills()
  return skills.filter(skill => skill.category === categoryId)
}
```

**Step 4: Create empty skills index**

Create `skills/skills/.gitkeep` (empty file)

Create `skills/index.json`:

```json
{
  "version": "1.0.0",
  "lastUpdated": "2025-01-22",
  "totalSkills": 0
}
```

**Step 5: Commit**

```bash
git add skills/ lib/schemas.ts lib/data.ts
git commit -m "feat: add data schemas and loader functions

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 4: Create Layout Components

**Files:**
- Create: `components/layout/Header.tsx`
- Create: `components/layout/Footer.tsx`
- Create: `components/layout/SkillCard.tsx`
- Modify: `app/layout.tsx`

**Step 1: Create Header component**

Create `components/layout/Header.tsx`:

```typescript
import Link from 'next/link'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="font-bold text-xl">SkillHub</div>
        </Link>

        <nav className="flex items-center space-x-6">
          <Link href="/browse" className="text-sm font-medium hover:text-primary">
            Browse
          </Link>
          <Link href="https://github.com" className="text-sm font-medium hover:text-primary">
            GitHub
          </Link>
          <Button asChild size="sm">
            <Link href="/browse">
              <Search className="mr-2 h-4 w-4" />
              Search
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  )
}
```

**Step 2: Create Footer component**

Create `components/layout/Footer.tsx`:

```typescript
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="w-full border-t py-6 md:py-8">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
        <p className="text-center text-sm text-muted-foreground md:text-left">
          Built with Next.js and shadcn/ui
        </p>
        <div className="flex gap-4">
          <Link href="https://github.com" className="text-sm text-muted-foreground hover:text-foreground">
            GitHub
          </Link>
          <Link href="https://twitter.com" className="text-sm text-muted-foreground hover:text-foreground">
            Twitter
          </Link>
        </div>
      </div>
    </footer>
  )
}
```

**Step 3: Create SkillCard component**

Create `components/layout/SkillCard.tsx`:

```typescript
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ExternalLink } from 'lucide-react'
import type { Skill } from '@/lib/schemas'

interface SkillCardProps {
  skill: Skill
}

export function SkillCard({ skill }: SkillCardProps) {
  return (
    <Link href={`/skill/${skill.id}`}>
      <Card className="h-full transition-all hover:scale-[1.02] hover:shadow-lg cursor-pointer">
        {skill.screenshot && (
          <div className="aspect-video w-full overflow-hidden rounded-t-lg bg-muted">
            <img
              src={skill.screenshot}
              alt={skill.name}
              className="h-full w-full object-cover"
            />
          </div>
        )}
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-xl">{skill.name}</CardTitle>
            {skill.featured && <Badge variant="secondary">Featured</Badge>}
          </div>
          <CardDescription className="line-clamp-2">
            {skill.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {skill.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {skill.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{skill.tags.length - 3}
              </Badge>
            )}
          </div>
          <div className="mt-4 flex items-center text-sm text-muted-foreground">
            <span>by {skill.author}</span>
            <ExternalLink className="ml-auto h-4 w-4" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
```

**Step 4: Update root layout**

Modify `app/layout.tsx`:

```typescript
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SkillHub - Discover Claude Code Skills',
  description: 'Browse and discover amazing agent skills for Claude Code',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
```

**Step 5: Commit**

```bash
git add components/layout app/layout.tsx
git commit -m "feat: add layout components (Header, Footer, SkillCard)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 5: Build Home Page

**Files:**
- Create: `components/home/Hero.tsx`
- Modify: `app/page.tsx`

**Step 1: Create Hero component**

Create `components/home/Hero.tsx`:

```typescript
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Search } from 'lucide-react'

export function Hero() {
  return (
    <section className="container px-4 py-24 mx-auto text-center">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
          Discover Amazing Claude Code Skills
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Browse our curated collection of powerful agent skills. Find the perfect tool to supercharge your Claude Code experience.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/browse">
              <Search className="mr-2 h-5 w-5" />
              Browse Skills
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="https://github.com">
              Contribute on GitHub
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
```

**Step 2: Create home page**

Modify `app/page.tsx`:

```typescript
import { Hero } from '@/components/home/Hero'
import { SkillCard } from '@/components/layout/SkillCard'
import { getFeaturedSkills, getSkills } from '@/lib/data'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  const featuredSkills = getFeaturedSkills()
  const allSkills = getSkills()
  const recentSkills = allSkills.slice(-6).reverse()

  return (
    <div className="flex flex-col">
      <Hero />

      {featuredSkills.length > 0 && (
        <section className="container py-12 px-4 mx-auto">
          <h2 className="text-3xl font-bold mb-8">Featured Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredSkills.map(skill => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>
        </section>
      )}

      <section className="container py-12 px-4 mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Recent Additions</h2>
          <Button asChild variant="outline">
            <Link href="/browse">View All</Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentSkills.map(skill => (
            <SkillCard key={skill.id} skill={skill} />
          ))}
        </div>
      </section>
    </div>
  )
}
```

**Step 3: Commit**

```bash
git add components/home app/page.tsx
git commit -m "feat: add home page with hero and skill sections

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 6: Build Browse Page with Search

**Files:**
- Create: `components/skills/SearchBar.tsx`
- Create: `components/skills/SkillGrid.tsx`
- Create: `components/skills/CategoryFilter.tsx`
- Create: `app/browse/page.tsx`

**Step 1: Create SearchBar component**

Create `components/skills/SearchBar.tsx`:

```typescript
'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'

export function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')

  useEffect(() => {
    const debounced = setTimeout(() => {
      if (query) {
        router.push(`/browse?q=${encodeURIComponent(query)}`)
      } else {
        router.push('/browse')
      }
    }, 300)

    return () => clearTimeout(debounced)
  }, [query, router])

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search skills..."
        className="pl-10"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  )
}
```

**Step 2: Create CategoryFilter component**

Create `components/skills/CategoryFilter.tsx`:

```typescript
'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import type { Category } from '@/lib/schemas'
import { cn } from '@/lib/utils'

interface CategoryFilterProps {
  categories: Category[]
}

export function CategoryFilter({ categories }: CategoryFilterProps) {
  const searchParams = useSearchParams()
  const currentCategory = searchParams.get('category')

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Categories</h3>
      <nav className="space-y-2">
        <Link href="/browse">
          <Badge
            variant={currentCategory === null ? 'default' : 'outline'}
            className="w-full justify-start cursor-pointer"
          >
            All Skills
          </Badge>
        </Link>
        {categories.map(category => (
          <Link key={category.id} href={`/browse?category=${category.id}`}>
            <Badge
              variant={currentCategory === category.id ? 'default' : 'outline'}
              className={cn(
                "w-full justify-start cursor-pointer"
              )}
            >
              {category.name}
            </Badge>
          </Link>
        ))}
      </nav>
    </div>
  )
}
```

**Step 3: Create SkillGrid component**

Create `components/skills/SkillGrid.tsx`:

```typescript
import { SkillCard } from '@/components/layout/SkillCard'
import type { Skill } from '@/lib/schemas'

interface SkillGridProps {
  skills: Skill[]
}

export function SkillGrid({ skills }: SkillGridProps) {
  if (skills.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No skills found matching your criteria.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {skills.map(skill => (
        <SkillCard key={skill.id} skill={skill} />
      ))}
    </div>
  )
}
```

**Step 4: Create browse page**

Create `app/browse/page.tsx`:

```typescript
import { Suspense } from 'react'
import { getSkills, getCategories } from '@/lib/data'
import { SearchBar } from '@/components/skills/SearchBar'
import { CategoryFilter } from '@/components/skills/CategoryFilter'
import { SkillGrid } from '@/components/skills/SkillGrid'

function BrowseContent({
  searchParams,
}: {
  searchParams: { q?: string; category?: string; sort?: string }
}) {
  const allSkills = getSkills()
  const categories = getCategories()

  let filteredSkills = allSkills

  // Filter by search query
  if (searchParams.q) {
    const Fuse = require('fuse.js')
    const fuse = new Fuse(allSkills, {
      keys: ['name', 'description', 'tags'],
      threshold: 0.3,
    })
    const results = fuse.search(searchParams.q)
    filteredSkills = results.map(r => r.item)
  }

  // Filter by category
  if (searchParams.category) {
    filteredSkills = filteredSkills.filter(
      skill => skill.category === searchParams.category
    )
  }

  // Sort
  if (searchParams.sort === 'recent') {
    filteredSkills.sort((a, b) =>
      new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime()
    )
  } else if (searchParams.sort === 'name') {
    filteredSkills.sort((a, b) => a.name.localeCompare(b.name))
  }

  return (
    <div className="container py-8 px-4 mx-auto">
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-64 flex-shrink-0">
          <CategoryFilter categories={categories} />
        </aside>

        <div className="flex-1">
          <div className="mb-6">
            <SearchBar />
          </div>
          <SkillGrid skills={filteredSkills} />
        </div>
      </div>
    </div>
  )
}

export default function BrowsePage({
  searchParams,
}: {
  searchParams: { q?: string; category?: string; sort?: string }
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BrowseContent searchParams={searchParams} />
    </Suspense>
  )
}
```

**Step 5: Commit**

```bash
git add components/skills app/browse
git commit -m "feat: add browse page with search and filters

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 7: Build Skill Detail Page

**Files:**
- Create: `components/skills/SkillDetail.tsx`
- Create: `app/skill/[id]/page.tsx`

**Step 1: Create SkillDetail component**

Create `components/skills/SkillDetail.tsx`:

```typescript
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Calendar, Tag, Github, ExternalLink } from 'lucide-react'
import type { Skill, Category } from '@/lib/schemas'

interface SkillDetailProps {
  skill: Skill
  category?: Category
}

export function SkillDetail({ skill, category }: SkillDetailProps) {
  return (
    <div className="container py-8 px-4 mx-auto max-w-4xl">
      <Link href="/browse">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Browse
        </Button>
      </Link>

      <div className="space-y-6">
        <div>
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-4xl font-bold">{skill.name}</h1>
            {skill.featured && <Badge variant="secondary">Featured</Badge>}
          </div>
          <p className="text-xl text-muted-foreground">{skill.description}</p>
        </div>

        {skill.screenshot && (
          <Card>
            <CardContent className="p-0">
              <img
                src={skill.screenshot}
                alt={skill.name}
                className="w-full rounded-lg"
              />
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm">
                <Github className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Author:</span>
                <span>{skill.author}</span>
              </div>
              {category && (
                <div className="flex items-center gap-2 text-sm">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Category:</span>
                  <span>{category.name}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Added:</span>
                <span>{new Date(skill.addedDate).toLocaleDateString()}</span>
              </div>
              {skill.version && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium">Version:</span>
                  <span>{skill.version}</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {skill.tags.map(tag => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {skill.usageExample && (
          <Card>
            <CardHeader>
              <CardTitle>Usage Example</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{skill.usageExample}</p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Installation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Get this skill from the repository below. Follow the installation instructions in the README.
            </p>
            <Button asChild>
              <Link href={skill.repository} target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-4 w-4" />
                View Repository
                <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
```

**Step 2: Create skill detail page**

Create `app/skill/[id]/page.tsx`:

```typescript
import { getSkillById, getSkills, getCategories } from '@/lib/data'
import { SkillDetail } from '@/components/skills/SkillDetail'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  const skills = getSkills()
  return skills.map(skill => ({
    id: skill.id,
  }))
}

export default function SkillPage({ params }: { params: { id: string } }) {
  const skill = getSkillById(params.id)
  const categories = getCategories()
  const category = categories.find(c => c.id === skill?.category)

  if (!skill) {
    notFound()
  }

  return <SkillDetail skill={skill} category={category} />
}
```

**Step 3: Add not-found page**

Create `app/not-found.tsx`:

```typescript
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="container py-24 px-4 mx-auto text-center">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Skill not found
      </p>
      <Button asChild>
        <Link href="/browse">Browse Skills</Link>
      </Button>
    </div>
  )
}
```

**Step 4: Commit**

```bash
git add components/skills/SkillDetail.tsx app/skill app/not-found.tsx
git commit -m "feat: add skill detail page

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 8: Add Sample Skills Data

**Files:**
- Create: `skills/skills/frontend-design.json`
- Create: `skills/skills/code-review.json`
- Create: `skills/skills/brainstorming.json`
- Modify: `skills/index.json`

**Step 1: Create frontend-design.json**

Create `skills/skills/frontend-design.json`:

```json
{
  "id": "frontend-design",
  "name": "Frontend Design",
  "description": "Create distinctive, production-grade frontend interfaces with high design quality. Avoids generic AI aesthetics for creative, polished code.",
  "category": "implementation",
  "author": "ui-ux-pro-max",
  "repository": "https://github.com/example/frontend-design",
  "version": "1.0.0",
  "tags": ["frontend", "ui", "design", "web", "react"],
  "addedDate": "2025-01-15",
  "featured": true,
  "usageExample": "Use this skill when the user asks to build web components, pages, or applications.",
  "compatibility": {
    "claudeCode": ">=1.0.0",
    "requires": []
  }
}
```

**Step 2: Create code-review.json**

Create `skills/skills/code-review.json`:

```json
{
  "id": "code-review",
  "name": "Code Reviewer",
  "description": "Review code against original plans and coding standards. Validates implementations and identifies issues.",
  "category": "process",
  "author": "superpowers",
  "repository": "https://github.com/example/code-review",
  "version": "1.0.0",
  "tags": ["review", "quality", "standards", "validation"],
  "addedDate": "2025-01-10",
  "featured": true,
  "usageExample": "Use this skill after completing a major feature implementation.",
  "compatibility": {
    "claudeCode": ">=1.0.0",
    "requires": []
  }
}
```

**Step 3: Create brainstorming.json**

Create `skills/skills/brainstorming.json`:

```json
{
  "id": "brainstorming",
  "name": "Brainstorming",
  "description": "Explore user intent, requirements and design before implementation. Essential for creative work.",
  "category": "process",
  "author": "superpowers",
  "repository": "https://github.com/example/brainstorming",
  "version": "1.0.0",
  "tags": ["brainstorming", "design", "planning", "requirements"],
  "addedDate": "2025-01-08",
  "featured": true,
  "usageExample": "Use this skill before any creative work or feature implementation.",
  "compatibility": {
    "claudeCode": ">=1.0.0",
    "requires": []
  }
}
```

**Step 4: Create more sample skills**

Create `skills/skills/test-driven-development.json`:

```json
{
  "id": "test-driven-development",
  "name": "Test Driven Development",
  "description": "Implement features and bugfixes using test-first methodology with red-green-refactor cycle.",
  "category": "process",
  "author": "superpowers",
  "repository": "https://github.com/example/tdd",
  "version": "1.0.0",
  "tags": ["testing", "tdd", "quality", "development"],
  "addedDate": "2025-01-05",
  "featured": false
}
```

Create `skills/skills/debugging.json`:

```json
{
  "id": "debugging",
  "name": "Systematic Debugging",
  "description": "Investigate bugs, test failures, and unexpected behavior methodically before proposing fixes.",
  "category": "process",
  "author": "superpowers",
  "repository": "https://github.com/example/debugging",
  "version": "1.0.0",
  "tags": ["debugging", "troubleshooting", "bugfix"],
  "addedDate": "2025-01-03",
  "featured": false
}
```

**Step 5: Update index.json**

Modify `skills/index.json`:

```json
{
  "version": "1.0.0",
  "lastUpdated": "2025-01-22",
  "totalSkills": 5
}
```

**Step 6: Commit**

```bash
git add skills/skills skills/index.json
git commit -m "feat: add sample skill data

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 9: Add Metadata and SEO

**Files:**
- Create: `app/metadata.ts`
- Modify: `app/skill/[id]/page.tsx`

**Step 1: Create metadata utilities**

Create `lib/metadata.ts`:

```typescript
import { Metadata } from 'next'

export function createSiteMetadata(): Metadata {
  return {
    title: {
      default: 'SkillHub - Discover Claude Code Skills',
      template: '%s | SkillHub'
    },
    description: 'Browse and discover amazing agent skills for Claude Code. Find the perfect tool to supercharge your development workflow.',
    keywords: ['Claude Code', 'agent skills', 'AI tools', 'developer tools'],
    authors: [{ name: 'SkillHub' }],
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: 'https://skillhub.example.com',
      siteName: 'SkillHub',
      title: 'SkillHub - Discover Claude Code Skills',
      description: 'Browse and discover amazing agent skills for Claude Code',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'SkillHub - Discover Claude Code Skills',
      description: 'Browse and discover amazing agent skills for Claude Code',
    },
  }
}

export function createSkillMetadata(skill: any): Metadata {
  return {
    title: skill.name,
    description: skill.description,
    openGraph: {
      title: skill.name,
      description: skill.description,
      type: 'website',
    },
  }
}
```

**Step 2: Update skill page metadata**

Modify `app/skill/[id]/page.tsx`:

```typescript
import { getSkillById, getSkills, getCategories } from '@/lib/data'
import { SkillDetail } from '@/components/skills/SkillDetail'
import { notFound } from 'next/navigation'
import { createSkillMetadata } from '@/lib/metadata'

export async function generateMetadata({ params }: { params: { id: string } }) {
  const skill = getSkillById(params.id)
  if (!skill) return {}
  return createSkillMetadata(skill)
}

export async function generateStaticParams() {
  const skills = getSkills()
  return skills.map(skill => ({
    id: skill.id,
  }))
}

export default function SkillPage({ params }: { params: { id: string } }) {
  const skill = getSkillById(params.id)
  const categories = getCategories()
  const category = categories.find(c => c.id === skill?.category)

  if (!skill) {
    notFound()
  }

  return <SkillDetail skill={skill} category={category} />
}
```

**Step 3: Commit**

```bash
git add lib/metadata.ts app/skill
git commit -m "feat: add SEO metadata

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 10: Configure Deployment

**Files:**
- Create: `.gitignore`
- Create: `deploy.sh`

**Step 1: Update .gitignore**

Create `.gitignore`:

```text
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
```

**Step 2: Create deployment script**

Create `deploy.sh`:

```bash
#!/bin/bash

# Build the site
echo "Building site..."
npm run build

# Deploy to gh-pages
echo "Deploying to GitHub Pages..."
npx gh-pages -d out

echo "Deployed successfully!"
```

Make it executable:

```bash
chmod +x deploy.sh
```

**Step 3: Add deployment dependencies**

```bash
npm install -D gh-pages
```

**Step 4: Update package.json with deploy script**

Modify `package.json` scripts:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "export": "next build",
    "start": "next start",
    "lint": "next lint",
    "deploy": "./deploy.sh"
  }
}
```

**Step 5: Create README**

Create `README.md`:

```markdown
# SkillHub

A navigation site for discovering Claude Code agent skills.

## Development

\`\`\`bash
npm install
npm run dev
\`\`\`

## Build

\`\`\`bash
npm run build
\`\`\`

## Deploy

\`\`\`bash
npm run deploy
\`\`\`

## Adding Skills

1. Create a new JSON file in `skills/skills/`
2. Follow the schema in `lib/schemas.ts`
3. The site will automatically include your skill

## License

MIT
```

**Step 6: Commit**

```bash
git add .gitignore deploy.sh README.md package.json
git commit -m "feat: add deployment configuration

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 11: Final Testing and Polish

**Files:**
- Test: All components
- Test: Build process
- Test: Navigation

**Step 1: Run development server**

```bash
npm run dev
```

Expected: Server starts on http://localhost:3000

**Step 2: Manual testing checklist**

- [ ] Home page loads and displays featured skills
- [ ] Browse page shows all skills
- [ ] Search functionality works
- [ ] Category filtering works
- [ ] Skill detail pages load correctly
- [ ] All links work
- [ ] Responsive design on mobile
- [ ] Dark mode toggle works

**Step 3: Run production build**

```bash
npm run build
```

Expected: Build completes without errors, static files in `out/`

**Step 4: Verify static export**

Check that `out/` directory contains:
- `index.html`
- `browse/index.html`
- `skill/[id]/index.html` for each skill

**Step 5: Fix any issues**

Address any build errors or warnings

**Step 6: Final commit**

```bash
git add .
git commit -m "chore: final polish and testing

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Completion Criteria

- [x] Next.js project initialized with TypeScript
- [x] shadcn/ui components integrated
- [x] Data schemas with Zod validation
- [x] Home page with hero section
- [x] Browse page with search and filters
- [x] Skill detail pages
- [x] Sample skill data added
- [x] Static export configured
- [x] Deployment scripts ready
- [x] Documentation complete

## Next Steps

1. Deploy to GitHub Pages
2. Add more skills to the collection
3. Gather user feedback
4. Consider adding features:
   - User ratings
   - Community submissions
   - Analytics tracking
