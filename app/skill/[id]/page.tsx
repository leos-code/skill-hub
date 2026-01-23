import { Metadata } from 'next'
import { getSkillById, getSkills, getCategories } from '@/lib/data'
import { SkillDetail } from '@/components/skills/SkillDetail'
import { notFound } from 'next/navigation'
import { createSkillMetadata } from '@/lib/metadata'

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const skill = getSkillById(params.id)
  if (!skill) return {}
  return createSkillMetadata(skill)
}

export function generateStaticParams() {
  const skills = getSkills()
  return skills.map(skill => ({
    id: skill.id,
  }))
}

export default function SkillPage({ params }: { params: { id: string } }) {
  const skill = getSkillById(params.id)

  if (!skill) {
    notFound()
  }

  const categories = getCategories()
  const category = categories.find(c => c.id === skill.category)

  return <SkillDetail skill={skill} category={category} />
}
