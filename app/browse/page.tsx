import { getSkills, getCategories } from '@/lib/data'
import { BrowseContent } from '@/components/skills/BrowseContent'
import { Suspense } from 'react'

export default function BrowsePage() {
  const allSkills = getSkills()
  const categories = getCategories()

  return (
    <Suspense fallback={<div className="container py-8 px-4 mx-auto">Loading...</div>}>
      <BrowseContent allSkills={allSkills} categories={categories} />
    </Suspense>
  )
}
