import { z } from 'zod'

export const CompatibilitySchema = z.object({
  claudeCode: z.string(),
  requires: z.array(z.string()),
  cursor: z.boolean().optional(),
  windsurf: z.boolean().optional(),
  copilot: z.boolean().optional(),
  kiro: z.boolean().optional(),
  codex: z.boolean().optional(),
  opencode: z.boolean().optional(),
})

export const SkillSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  category: z.string().min(1),
  author: z.string().min(1),
  repository: z.string().url(),
  version: z.string(),
  tags: z.array(z.string()),
  addedDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(
    (date) => {
      const parsed = new Date(date)
      return !isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === date
    },
    { message: "Invalid date format or date" }
  ),
  featured: z.boolean().default(false),
  screenshot: z.string().optional(),
  usageExample: z.string().optional(),
  compatibility: CompatibilitySchema.optional(),
})

export const CategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  icon: z.string(),
})

export type Skill = z.infer<typeof SkillSchema>
export type Category = z.infer<typeof CategorySchema>
