import { Metadata } from 'next'
import { Skill } from './schemas'

export function createSiteMetadata(): Metadata {
  return {
    title: {
      default: 'SkillHub - Discover Claude Code Skills',
      template: '%s | SkillHub'
    },
    description: 'Browse and discover amazing agent skills for Claude Code. Find the perfect tool to supercharge your development workflow.',
    keywords: ['Claude Code', 'agent skills', 'AI tools', 'developer tools'],
    authors: [{ name: 'SkillHub' }],
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: 'https://skillhub.example.com',
      siteName: 'SkillHub',
      title: 'SkillHub - Discover Claude Code Skills',
      description: 'Browse and discover amazing agent skills for Claude Code',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'SkillHub - Discover Claude Code Skills',
      description: 'Browse and discover amazing agent skills for Claude Code',
    },
  }
}

export function createSkillMetadata(skill: Skill): Metadata {
  return {
    title: skill.name,
    description: skill.description,
    openGraph: {
      title: skill.name,
      description: skill.description,
      type: 'website',
    },
  }
}
