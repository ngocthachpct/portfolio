'use client'

import { useState, useEffect, useRef } from 'react'
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
import { Container } from '@/components/container'
import { toast } from 'sonner'
import { Upload, X } from 'lucide-react'
import Image from 'next/image'

const formSchema = z.object({
  title: z.string().min(2, {
    message: 'Title must be at least 2 characters.',
  }),
  description: z.string().min(10, {
    message: 'Description must be at least 10 characters.',
  }),
  imageUrl: z.string(),
  githubUrl: z.string().url({
    message: 'Please enter a valid GitHub URL.',
  }),
  liveUrl: z.string().url({
    message: 'Please enter a valid live project URL.',
  }).optional().or(z.literal('')),
})

type Project = z.infer<typeof formSchema> & {
  id: string
  createdAt: string
}

export default function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [projectId, setProjectId] = useState<string>('')

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      imageUrl: '',
      githubUrl: '',
      liveUrl: '',
    },
  })

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params
      setProjectId(resolvedParams.id)
      
      // Fetch the project data
      const fetchProject = async () => {
        try {
          // Fetch project from the API
          const response = await fetch(`/api/projects/${resolvedParams.id}`)
          
          if (!response.ok) {
            throw new Error('Failed to fetch project')
          }
          
          const project = await response.json()
          
          // Set form values
          form.reset({
            title: project.title,
            description: project.description,
            imageUrl: project.imageUrl,
            githubUrl: project.githubUrl || '',
            liveUrl: project.liveUrl || '',
          })
          
          // Set image preview
          setImagePreview(project.imageUrl)
        } catch (error) {
          console.error('Error fetching project:', error)
          toast.error('Failed to load project')
          router.push('/admin/projects')
        } finally {
          setIsFetching(false)
        }
      }

      fetchProject()
    }
    
    getParams()
  }, [params, form, router])

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to upload image')
      }

      const data = await response.json()
      const imageUrl = data.url

      // Update form field and preview
      form.setValue('imageUrl', imageUrl)
      setImagePreview(imageUrl)
      toast.success('Image uploaded successfully')
    } catch (error) {
      toast.error('Failed to upload image')
      console.error('Upload error:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleImageUrlChange = (url: string) => {
    setImagePreview(url)
  }

  const removeImage = () => {
    form.setValue('imageUrl', '')
    setImagePreview('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      // Prepare the data for API
      const projectData = {
        title: values.title,
        description: values.description,
        imageUrl: values.imageUrl,
        githubUrl: values.githubUrl,
        liveUrl: values.liveUrl || null,
      }
      
      // Send PUT request to the API
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update project')
      }
      
      toast.success('Project updated successfully')
      router.push('/admin/projects')
      router.refresh() // Refresh the page to show the updated project
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update project')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isFetching) {
    return (
      <Container>
        <div className="py-10 text-center">Loading project data...</div>
      </Container>
    )
  }

  return (
    <Container>
      <div className="py-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Edit Project</h1>
          <Button variant="outline" onClick={() => router.push('/admin/projects')}>
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
                    <FormLabel>Project Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      The name of your project.
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
                        className="min-h-32" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      A detailed description of your project, its features, and technologies used.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Image</FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        {/* Image Preview */}
                        {imagePreview && (
                          <div className="relative w-full max-w-md">
                            <div className="relative aspect-video rounded-lg overflow-hidden border">
                              <Image
                                src={imagePreview}
                                alt="Project preview"
                                fill
                                className="object-cover"
                                onError={() => setImagePreview('')}
                                unoptimized={imagePreview.startsWith('http://localhost')}
                              />
                            </div>
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                              onClick={removeImage}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        )}

                        {/* Upload Button */}
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isUploading}
                          className="flex items-center gap-2"
                        >
                          <Upload className="h-4 w-4" />
                          {isUploading ? 'Uploading...' : 'Upload Image'}
                        </Button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              handleFileUpload(file)
                            }
                          }}
                        />

                        {/* Hidden input for form validation */}
                        <Input 
                          {...field} 
                          type="hidden"
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Upload an image file that represents your project.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="githubUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GitHub URL</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      The URL to your project's GitHub repository.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="liveUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Live URL (Optional)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      The URL to the live version of your project, if available.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end">
                <Button type="submit" disabled={isLoading || isUploading}>
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Container>
  )
}