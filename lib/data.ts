import fs from 'fs'
import path from 'path'
import { SkillSchema, CategorySchema, type Skill, type Category } from './schemas'

const skillsDir = path.join(process.cwd(), 'skills')
const skillsFileDir = path.join(skillsDir, 'skills')

export function getCategories(): Category[] {
  const fullPath = path.join(skillsDir, 'categories.json')
  const content = fs.readFileSync(fullPath, 'utf8')
  const data = JSON.parse(content)

  return Object.entries(data).map(([id, cat]: [string, any]) => ({
    ...cat,
    id,
  }))
}

export function getSkills(): Skill[] {
  const files = fs.readdirSync(skillsFileDir)
  const skills: Skill[] = []

  for (const file of files) {
    if (file.endsWith('.json')) {
      const fullPath = path.join(skillsFileDir, file)
      const content = fs.readFileSync(fullPath, 'utf8')
      const data = JSON.parse(content)

      const validated = SkillSchema.parse(data)
      skills.push(validated)
    }
  }

  return skills.sort((a, b) => a.name.localeCompare(b.name))
}

export function getSkillById(id: string): Skill | undefined {
  const skills = getSkills()
  return skills.find(skill => skill.id === id)
}

export function getFeaturedSkills(): Skill[] {
  const skills = getSkills()
  return skills.filter(skill => skill.featured)
}

export function getSkillsByCategory(categoryId: string): Skill[] {
  const skills = getSkills()
  return skills.filter(skill => skill.category === categoryId)
}
