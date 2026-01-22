import fs from 'fs'
import path from 'path'
import { SkillSchema, CategorySchema, type Skill, type Category } from './schemas'

const skillsDir = path.join(process.cwd(), 'skills')
const skillsFileDir = path.join(skillsDir, 'skills')

export function getCategories(): Category[] {
  try {
    const fullPath = path.join(skillsDir, 'categories.json')
    const content = fs.readFileSync(fullPath, 'utf8')
    const data = JSON.parse(content)

    return Object.entries(data).map(([id, cat]: [string, unknown]) => {
      const categoryData = typeof cat === 'object' && cat !== null ? cat : {}
      const validated = CategorySchema.parse({ ...categoryData, id })
      return validated
    })
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to load categories: ${error.message}`)
    }
    throw new Error('Failed to load categories: Unknown error')
  }
}

export function getSkills(): Skill[] {
  try {
    const files = fs.readdirSync(skillsFileDir)
    const skills: Skill[] = []

    for (const file of files) {
      if (file.endsWith('.json')) {
        try {
          const fullPath = path.join(skillsFileDir, file)
          const content = fs.readFileSync(fullPath, 'utf8')
          const data = JSON.parse(content)

          const validated = SkillSchema.parse(data)
          skills.push(validated)
        } catch (error) {
          // Skip invalid skill files but log the error
          console.warn(`Failed to load skill from ${file}:`, error)
        }
      }
    }

    // Note: This function is called by multiple other functions (getSkillById, getFeaturedSkills, getSkillsByCategory)
    // which causes redundant file I/O. In production, consider implementing caching or a singleton pattern.
    return skills.sort((a, b) => a.name.localeCompare(b.name))
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to load skills: ${error.message}`)
    }
    throw new Error('Failed to load skills: Unknown error')
  }
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
