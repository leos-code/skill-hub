'use client'

import { useState, useMemo, useEffect } from 'react'
import Fuse from 'fuse.js'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { SkillCard } from '@/components/layout/SkillCard'
import type { Skill } from '@/lib/schemas'

interface HomeSearchProps {
  allSkills: Skill[]
  onSearchChange?: (hasQuery: boolean) => void
}

export function HomeSearch({ allSkills, onSearchChange }: HomeSearchProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return []
    }

    const fuse = new Fuse(allSkills, {
      keys: ['name', 'description', 'tags'],
      threshold: 0.3,
    })

    const results = fuse.search(searchQuery)
    return results.map((r: { item: Skill }) => r.item)
  }, [searchQuery, allSkills])

  const hasSearchQuery = searchQuery.trim().length > 0
  const showSearchResults = hasSearchQuery && searchResults.length > 0

  useEffect(() => {
    onSearchChange?.(hasSearchQuery)
  }, [hasSearchQuery, onSearchChange])

  return (
    <section className="container pt-0 pb-2 px-4 mx-auto">
      <div className="max-w-2xl mx-auto mb-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search skills by name, description, or tags..."
            className="pl-10 h-12 text-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {hasSearchQuery && (
          <p className="text-sm text-muted-foreground mt-2 text-center">
            {searchResults.length > 0
              ? `Found ${searchResults.length} skill${searchResults.length !== 1 ? 's' : ''}`
              : 'No skills found matching your search'}
          </p>
        )}
      </div>

      {showSearchResults && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {searchResults.map(skill => (
            <SkillCard key={skill.id} skill={skill} />
          ))}
        </div>
      )}
    </section>
  )
}
