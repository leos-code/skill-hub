import { Suspense } from 'react'
import { getSkills, getCategories } from '@/lib/data'
import { SearchBar } from '@/components/skills/SearchBar'
import { CategoryFilter } from '@/components/skills/CategoryFilter'
import { SkillGrid } from '@/components/skills/SkillGrid'
import Fuse from 'fuse.js'
import type { Skill } from '@/lib/schemas'

function BrowseContent({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; sort?: string }>
}) {
  const allSkills = getSkills()
  const categories = getCategories()

  let filteredSkills = allSkills

  // Filter by search query
  if (searchParams.q) {
    const fuse = new Fuse(allSkills, {
      keys: ['name', 'description', 'tags'],
      threshold: 0.3,
    })
    const results = fuse.search(searchParams.q)
    filteredSkills = results.map((r: { item: Skill }) => r.item)
  }

  // Filter by category
  if (searchParams.category) {
    filteredSkills = filteredSkills.filter(
      skill => skill.category === searchParams.category
    )
  }

  // Sort
  if (searchParams.sort === 'recent') {
    filteredSkills = [...filteredSkills].sort((a, b) =>
      new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime()
    )
  } else if (searchParams.sort === 'name') {
    filteredSkills = [...filteredSkills].sort((a, b) => a.name.localeCompare(b.name))
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
  searchParams: Promise<{ q?: string; category?: string; sort?: string }>
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BrowseContent searchParams={searchParams} />
    </Suspense>
  )
}
