import { Hero } from '@/components/home/Hero'
import { HomeContent } from '@/components/home/HomeContent'
import { getFeaturedSkills, getSkills } from '@/lib/data'

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
