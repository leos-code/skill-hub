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
