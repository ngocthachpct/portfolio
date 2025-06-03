'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Container } from '@/components/container'
import { toast } from 'sonner'

const formSchema = z.object({
  title: z.string().min(2, {
    message: 'Title must be at least 2 characters.',
  }),
  slug: z.string().min(2, {
    message: 'Slug must be at least 2 characters.',
  }).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Slug must contain only lowercase letters, numbers, and hyphens.',
  }),
  content: z.string().min(10, {
    message: 'Content must be at least 10 characters.',
  }),
  published: z.boolean(),
})

type FormData = z.infer<typeof formSchema>

export default function NewBlogPostPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      slug: '',
      content: '',
      published: false,
    },
  })

  // Function to generate a slug from the title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/--+/g, '-') // Replace multiple hyphens with a single hyphen
      .trim() // Trim leading/trailing spaces
  }

  // Handle title change to auto-generate slug
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    form.setValue('title', title)
    
    // Only auto-update slug if it's empty or was previously auto-generated
    const currentSlug = form.getValues('slug')
    const previousTitle = form.getValues('title')
    const previousAutoSlug = generateSlug(previousTitle)
    
    if (!currentSlug || currentSlug === previousAutoSlug) {
      form.setValue('slug', generateSlug(title))
    }
  }

  async function onSubmit(values: FormData) {
    setIsLoading(true)
    try {
      // Prepare the data for API
      const blogPostData = {
        title: values.title,
        slug: values.slug,
        content: values.content,
        published: values.published,
      }
      
      // Send POST request to the API
      const response = await fetch('/api/blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(blogPostData),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create blog post')
      }
      
      toast.success('Blog post created successfully')
      router.push('/admin/blog')
      router.refresh() // Refresh the page to show the new blog post
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create blog post')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Container>
      <div className="py-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Create New Blog Post</h1>
          <Button variant="outline" onClick={() => router.push('/admin/blog')}>
            Cancel
          </Button>
        </div>

        <div className="max-w-2xl mx-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="My Awesome Blog Post" 
                        {...field} 
                        onChange={handleTitleChange}
                      />
                    </FormControl>
                    <FormDescription>
                      The title of your blog post.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="my-awesome-blog-post" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      The URL-friendly version of the title. Auto-generated from the title but can be customized.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Write your blog post content here..." 
                        className="min-h-64" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      The content of your blog post. Markdown is supported.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="published"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Published
                      </FormLabel>
                      <FormDescription>
                        When checked, this post will be visible to the public immediately.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Creating...' : 'Create Blog Post'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Container>
  )
}