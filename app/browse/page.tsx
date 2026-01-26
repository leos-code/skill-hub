import { Metadata } from 'next'
import { getSkills, getCategories } from '@/lib/data'
import { BrowseContent } from '@/components/skills/BrowseContent'
import { Suspense } from 'react'
import { SITE_URL } from '@/lib/site'

const baseUrl = SITE_URL.replace(/\/$/, '')

export const metadata: Metadata = {
  title: 'Browse Skills',
  description: 'Browse and search through all available Claude Code skills. Filter by category, search by name or tags, and discover the perfect tool for your workflow.',
  alternates: { canonical: baseUrl + '/browse/' },
  openGraph: {
    title: 'Browse Skills | SkillHub',
    description: 'Browse and search through all available Claude Code skills',
    url: baseUrl + '/browse/',
  },
}

export default function BrowsePage() {
  const allSkills = getSkills()
  const categories = getCategories()

  return (
    <Suspense fallback={<div className="container py-8 px-4 mx-auto">Loading...</div>}>
      <BrowseContent allSkills={allSkills} categories={categories} />
    </Suspense>
  )
}
