import { getSkillById, getSkills, getCategories } from '@/lib/data'
import { SkillDetail } from '@/components/skills/SkillDetail'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  const skills = getSkills()
  return skills.map(skill => ({
    id: skill.id,
  }))
}

export default function SkillPage({ params }: { params: { id: string } }) {
  const skill = getSkillById(params.id)
  const categories = getCategories()
  const category = categories.find(c => c.id === skill?.category)

  if (!skill) {
    notFound()
  }

  return <SkillDetail skill={skill} category={category} />
}
