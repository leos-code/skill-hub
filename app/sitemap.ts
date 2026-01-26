import type { MetadataRoute } from 'next'
import { getSkills } from '@/lib/data'
import { SITE_URL } from '@/lib/site'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const skills = getSkills()
  const base = SITE_URL.replace(/\/$/, '')

  const routes: MetadataRoute.Sitemap = [
    {
      url: `${base}/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${base}/browse/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ]

  const skillPages: MetadataRoute.Sitemap = skills.map((skill) => ({
    url: `${base}/skill/${skill.id}/`,
    lastModified: new Date(skill.addedDate),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  return [...routes, ...skillPages]
}
