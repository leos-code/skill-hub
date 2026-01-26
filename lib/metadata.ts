import { Metadata } from 'next'
import { Skill } from './schemas'
import { SITE_URL } from './site'

const baseUrl = SITE_URL.replace(/\/$/, '')

export function createSiteMetadata(): Metadata {
  return {
    metadataBase: new URL(baseUrl),
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
      url: baseUrl + '/',
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

export function createSkillMetadata(skill: Skill, path: string): Metadata {
  const url = baseUrl + path
  const ogImage = skill.screenshot?.startsWith('http')
    ? skill.screenshot
    : skill.screenshot
      ? baseUrl + (skill.screenshot.startsWith('/') ? skill.screenshot : '/' + skill.screenshot)
      : undefined

  return {
    title: skill.name,
    description: skill.description,
    keywords: skill.tags?.length ? skill.tags : undefined,
    alternates: { canonical: url },
    openGraph: {
      title: skill.name,
      description: skill.description,
      type: 'website',
      url,
      ...(ogImage && { images: [{ url: ogImage, alt: skill.name }] }),
    },
    twitter: {
      card: ogImage ? 'summary_large_image' : 'summary',
      title: skill.name,
      description: skill.description,
    },
  }
}
