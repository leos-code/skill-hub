import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Search } from 'lucide-react'

export function Hero() {
  return (
    <section className="container px-4 py-24 mx-auto text-center">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
          Discover Amazing Claude Code Skills
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Browse our curated collection of powerful agent skills. Find the perfect tool to supercharge your Claude Code experience.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/browse">
              <Search className="mr-2 h-5 w-5" />
              Browse Skills
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="https://github.com">
              Contribute on GitHub
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
