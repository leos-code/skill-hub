import Link from 'next/link'

export function Footer() {
  return (
    <footer className="w-full border-t py-6 md:py-8">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
        <p className="text-center text-sm text-muted-foreground md:text-left">
          Built with Next.js and shadcn/ui
        </p>
        <div className="flex gap-4">
          <Link href="https://github.com" className="text-sm text-muted-foreground hover:text-foreground" target="_blank" rel="noopener noreferrer">
            GitHub
          </Link>
          <Link href="https://twitter.com" className="text-sm text-muted-foreground hover:text-foreground" target="_blank" rel="noopener noreferrer">
            Twitter
          </Link>
        </div>
      </div>
    </footer>
  )
}
