import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="container py-24 px-4 mx-auto text-center">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Skill not found
      </p>
      <Button asChild>
        <Link href="/browse">Browse Skills</Link>
      </Button>
    </div>
  )
}
