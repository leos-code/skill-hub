'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Calendar, Tag, Github, ExternalLink, Copy, Check } from 'lucide-react'
import type { Skill, Category } from '@/lib/schemas'
import { useState } from 'react'

interface SkillDetailProps {
  skill: Skill
  category?: Category
}

export function SkillDetail({ skill, category }: SkillDetailProps) {
  const [copied, setCopied] = useState(false)

  // Extract owner from GitHub repository URL
  const getGithubOwner = (url: string): string => {
    try {
      const match = url.match(/github\.com\/([^\/]+)/)
      return match ? match[1] : 'Unknown'
    } catch {
      return 'Unknown'
    }
  }

  // Generate installation command
  const installCommand = `npx skills add ${skill.repository} --skill ${skill.name}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(installCommand)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const author = getGithubOwner(skill.repository)

  return (
    <div className="container py-8 px-4 mx-auto max-w-4xl">
      <Link href="/browse">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Browse
        </Button>
      </Link>

      <div className="space-y-6">
        <div>
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-4xl font-bold">{skill.name}</h1>
            {skill.featured && <Badge variant="secondary">Featured</Badge>}
          </div>
          <p className="text-xl text-muted-foreground">{skill.description}</p>
        </div>

        {skill.screenshot && (
          <Card>
            <CardContent className="p-0">
              <img
                src={skill.screenshot}
                alt={skill.name}
                className="w-full rounded-lg"
              />
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm">
                <Github className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Author:</span>
                <span>{author}</span>
              </div>
              {category && (
                <div className="flex items-center gap-2 text-sm">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Category:</span>
                  <span>{category.name}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Added:</span>
                <span>{new Date(skill.addedDate).toLocaleDateString()}</span>
              </div>
              {skill.version && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium">Version:</span>
                  <span>{skill.version}</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {skill.tags.map(tag => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {skill.usageExample && (
          <Card>
            <CardHeader>
              <CardTitle>Usage Example</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{skill.usageExample}</p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Installation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Run this command in your terminal to install this skill:
            </p>
            <div className="relative group">
              <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                <code>{installCommand}</code>
              </pre>
              <Button
                size="sm"
                variant="ghost"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={handleCopy}
              >
                {copied ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button asChild>
                <Link href={skill.repository} target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" />
                  View Repository
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
