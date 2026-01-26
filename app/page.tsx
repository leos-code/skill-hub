import { Metadata } from 'next'
import { Hero } from '@/components/home/Hero'
import { HomeContent } from '@/components/home/HomeContent'
import { getFeaturedSkills, getSkills } from '@/lib/data'
import { SITE_URL } from '@/lib/site'

const baseUrl = SITE_URL.replace(/\/$/, '')

export const metadata: Metadata = {
  alternates: { canonical: baseUrl + '/' },
  openGraph: {
    url: baseUrl + '/',
  },
}

export default function HomePage() {
  const featuredSkills = getFeaturedSkills()
  const allSkills = getSkills()
  const recentSkills = allSkills.slice(-6).reverse()

  return (
    <div className="flex flex-col">
      <Hero />
      <HomeContent 
        featuredSkills={featuredSkills}
        recentSkills={recentSkills}
        allSkills={allSkills}
      />
    </div>
  )
}
