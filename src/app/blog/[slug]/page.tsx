import { Container } from '@/components/container'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, Calendar, Clock } from 'lucide-react'
import Link from 'next/link'
import { prisma } from '@/lib/db'
import { format } from 'date-fns'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'

export const revalidate = 60 // revalidate this page every 60 seconds

type BlogPostPageProps = {
  params: Promise<{
    slug: string
  }>
}

// Generate metadata for the page
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await prisma.blogPost.findUnique({
    where: {
      slug,
      published: true,
    },
  })

  if (!post) {
    return {
      title: 'Blog Post Not Found',
    }
  }

  return {
    title: post.title,
    description: post.content.substring(0, 160),
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await prisma.blogPost.findUnique({
    where: {
      slug,
      published: true,
    },
  })

  if (!post) {
    notFound()
  }

  // Calculate estimated reading time (rough estimate: 200 words per minute)
  const wordCount = post.content.split(/\s+/).length
  const readingTime = Math.max(1, Math.ceil(wordCount / 200))

  return (
    <Container>
      <div className="py-10">
        <div className="mb-8">
          <Button asChild variant="ghost" className="mb-6">
            <Link href="/blog" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
          </Button>

          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{format(new Date(post.createdAt), 'MMMM d, yyyy')}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{readingTime} min read</span>
            </div>
          </div>

          <Separator />
        </div>

        <div className="prose prose-lg max-w-none dark:prose-invert">
          {/* Render the content - in a real app, you might want to use a markdown renderer */}
          {post.content.split('\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>
    </Container>
  )
}