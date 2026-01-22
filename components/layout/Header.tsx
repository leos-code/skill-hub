import Link from 'next/link'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="font-bold text-xl">SkillHub</div>
        </Link>

        <nav className="flex items-center space-x-6">
          <Link href="/browse" className="text-sm font-medium hover:text-primary">
            Browse
          </Link>
          <Link href="https://github.com" className="text-sm font-medium hover:text-primary">
            GitHub
          </Link>
          <Button asChild size="sm">
            <Link href="/browse">
              <Search className="mr-2 h-4 w-4" />
              Search
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  )
}
