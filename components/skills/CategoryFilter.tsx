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

  // Build URL params preserving existing query
  const buildUrl = (categoryId?: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (categoryId) {
      params.set('category', categoryId)
    } else {
      params.delete('category')
    }
    const queryString = params.toString()
    return `/browse${queryString ? `?${queryString}` : ''}`
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Categories</h3>
      <nav className="space-y-2">
        <Link href={buildUrl()}>
          <Badge
            variant={currentCategory === null ? 'default' : 'outline'}
            className="w-full justify-start cursor-pointer"
          >
            All Skills
          </Badge>
        </Link>
        {categories.map(category => (
          <Link key={category.id} href={buildUrl(category.id)}>
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
