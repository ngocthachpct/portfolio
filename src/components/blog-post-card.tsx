import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight, Calendar } from 'lucide-react'
import Link from 'next/link'

type BlogPostCardProps = {
  title: string
  slug: string
  excerpt: string
  date: string
}

export function BlogPostCard({ title, slug, excerpt, date }: BlogPostCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-all duration-300 rounded-2xl border">
      <CardHeader>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{date}</span>
          </div>
        </div>
        <CardTitle className="text-xl">
          <Link
            href={`/blog/${slug}`}
            className="hover:text-primary transition-colors"
          >
            {title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="line-clamp-3">
          {excerpt}
        </CardDescription>
      </CardContent>
      <CardFooter>
        <Button asChild variant="ghost" className="p-0 h-auto">
          <Link
            href={`/blog/${slug}`}
            className="flex items-center text-primary font-medium hover:underline"
          >
            Read More <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}