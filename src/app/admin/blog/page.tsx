'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/container'
import { toast } from 'sonner'
import { Pencil, Trash, Plus, Eye, EyeOff } from 'lucide-react'
import { format } from 'date-fns'

type BlogPost = {
  id: string
  title: string
  slug: string
  content: string
  published: boolean
  createdAt: string
}

export default function BlogAdminPage() {
  const router = useRouter()
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Fetch blog posts from the API
    const fetchBlogPosts = async () => {
      try {
        const response = await fetch('/api/blog?includeUnpublished=true')
        
        if (!response.ok) {
          throw new Error('Failed to fetch blog posts')
        }
        
        const data = await response.json()
        setBlogPosts(data)
      } catch (error) {
        console.error('Error fetching blog posts:', error)
        toast.error('Failed to load blog posts')
      } finally {
        setIsLoading(false)
      }
    }

    fetchBlogPosts()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return
    
    try {
      // Find the post to get its slug
      const post = blogPosts.find(p => p.id === id)
      if (!post) return
      
      const response = await fetch(`/api/blog/${post.slug}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete blog post')
      }
      
      // Update local state
      setBlogPosts(blogPosts.filter(post => post.id !== id))
      toast.success('Blog post deleted successfully')
    } catch (error) {
      console.error('Error deleting blog post:', error)
      toast.error('Failed to delete blog post')
    }
  }

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    try {
      const post = blogPosts.find(p => p.id === id)
      if (!post) return
      
      const response = await fetch(`/api/blog/${post.slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: post.title,
          slug: post.slug,
          content: post.content,
          published: !currentStatus,
        }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to update blog post')
      }
      
      // Update local state
      setBlogPosts(blogPosts.map(post => 
        post.id === id ? { ...post, published: !currentStatus } : post
      ))
      
      toast.success(`Blog post ${!currentStatus ? 'published' : 'unpublished'} successfully`)
    } catch (error) {
      console.error('Error updating blog post:', error)
      toast.error('Failed to update blog post')
    }
  }

  return (
    <Container>
      <div className="py-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Manage Blog Posts</h1>
          <Button onClick={() => router.push('/admin/blog/new')}>
            <Plus className="mr-2 h-4 w-4" /> Add New Post
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-10">Loading blog posts...</div>
        ) : blogPosts.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground mb-4">No blog posts found</p>
            <Button onClick={() => router.push('/admin/blog/new')}>
              Create Your First Blog Post
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {blogPosts.map((post) => (
              <div 
                key={post.id} 
                className="border rounded-lg p-4 flex justify-between items-center"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-semibold text-xl">{post.title}</h2>
                    <span className={`text-xs px-2 py-1 rounded-full ${post.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {format(new Date(post.createdAt), 'MMM d, yyyy')} • /{post.slug}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => handleTogglePublish(post.id, post.published)}
                    title={post.published ? 'Unpublish' : 'Publish'}
                  >
                    {post.published ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => router.push(`/admin/blog/edit/${post.slug}`)}
                    title="Edit"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="icon"
                    onClick={() => handleDelete(post.id)}
                    title="Delete"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Container>
  )
}