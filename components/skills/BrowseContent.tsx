'use client'

import Fuse from 'fuse.js'
import type { Skill, Category } from '@/lib/schemas'
import { SearchBar } from '@/components/skills/SearchBar'
import { CategoryFilter } from '@/components/skills/CategoryFilter'
import { SkillGrid } from '@/components/skills/SkillGrid'
import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'

interface BrowseContentProps {
  allSkills: Skill[]
  categories: Category[]
}

export function BrowseContent({ allSkills, categories }: BrowseContentProps) {
  const searchParams = useSearchParams()

  const q = searchParams.get('q') || ''
  const category = searchParams.get('category') || ''
  const sort = searchParams.get('sort') || ''

  const filteredSkills = useMemo(() => {
    let skills = allSkills

    // Filter by search query
    if (q) {
      const fuse = new Fuse(skills, {
        keys: ['name', 'description', 'tags'],
        threshold: 0.3,
      })
      const results = fuse.search(q)
      skills = results.map((r: { item: Skill }) => r.item)
    }

    // Filter by category
    if (category) {
      skills = skills.filter(skill => skill.category === category)
    }

    // Sort
    if (sort === 'recent') {
      skills = [...skills].sort((a, b) =>
        new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime()
      )
    } else if (sort === 'name') {
      skills = [...skills].sort((a, b) => a.name.localeCompare(b.name))
    }

    return skills
  }, [allSkills, q, category, sort])

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
