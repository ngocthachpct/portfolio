import { Container } from '@/components/container'
import { BlogPostCard } from '@/components/blog-post-card'
import { prisma } from '@/lib/db'
import { format } from 'date-fns'

export const revalidate = 60 // revalidate this page every 60 seconds

export default async function BlogPage() {
  // Fetch published blog posts from the database
  const blogPosts = await prisma.blogPost.findMany({
    where: {
      published: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <Container>
      <div className="py-10">
        <h1 className="text-3xl font-bold mb-8">Blog</h1>
        
        {blogPosts.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground">No blog posts found</p>
          </div>
        ) : (
          <div className="grid gap-8">
            {blogPosts.map((post) => (
              <BlogPostCard
                key={post.id}
                title={post.title}
                slug={post.slug}
                excerpt={post.content.substring(0, 150) + '...'}
                date={format(new Date(post.createdAt), 'MMMM d, yyyy')}
              />
            ))}
          </div>
        )}
      </div>
    </Container>
  )
}