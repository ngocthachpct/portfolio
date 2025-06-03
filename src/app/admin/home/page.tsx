'use client'

import React from 'react'
import { useState, useEffect } from 'react'
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
// Import Container directly from the file path
import { Container } from '@/components/container'
import { toast } from 'sonner'

const formSchema = z.object({
  title: z.string().min(2, {
    message: 'Title must be at least 2 characters.',
  }),
  subtitle: z.string().min(2, {
    message: 'Subtitle must be at least 2 characters.',
  }),
  description: z.string().min(10, {
    message: 'Description must be at least 10 characters.',
  }),
})

export default function AdminHomePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      subtitle: "",
      description: "",
    },
  })
  
  // Fetch current home content when the page loads
  useEffect(() => {
    const fetchHomeContent = async () => {
      try {
        const response = await fetch('/api/home')
        if (!response.ok) {
          throw new Error('Failed to fetch home content')
        }
        const data = await response.json()
        
        // Update form with fetched data
        form.reset({
          title: data.title,
          subtitle: data.subtitle,
          description: data.description,
        })
      } catch (error) {
        console.error('Error fetching home content:', error)
        toast.error('Failed to load home content')
      } finally {
        setIsFetching(false)
      }
    }
    
    fetchHomeContent()
  }, [form])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      // Save to the database via API
      const response = await fetch('/api/home', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })
      
      if (!response.ok) {
        throw new Error('Failed to update home content')
      }
      
      toast.success('Homepage content updated successfully')
      
      // Refresh the page to show updated content
      router.refresh()
    } catch (error) {
      toast.error('Failed to update homepage content')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Container>
      <div className="py-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Edit Homepage</h1>
          <Button variant="outline" onClick={() => router.push('/admin/dashboard')}>
            Back to Dashboard
          </Button>
        </div>

        {isFetching ? (
          <div className="text-center py-10">Loading home content...</div>
        ) : (
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
                      <Input placeholder="Enter your name or title" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is the main heading displayed on your homepage.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="subtitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subtitle</FormLabel>
                    <FormControl>
                      <Input placeholder="Your role or tagline" {...field} />
                    </FormControl>
                    <FormDescription>
                      This appears below your name as a subtitle or role description.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Write a brief description about yourself" 
                        className="min-h-32" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      This is the main paragraph describing you and your skills.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
        )}
      </div>
    </Container>
  )
}