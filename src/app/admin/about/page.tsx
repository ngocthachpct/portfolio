'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import Image from 'next/image'
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

const formSchema = z.object({
  aboutTitle: z.string().min(2, {
    message: 'Title must be at least 2 characters.',
  }),
  aboutDescription: z.string().min(10, {
    message: 'Description must be at least 10 characters.',
  }),
  heading: z.string().min(2, {
    message: 'Heading must be at least 2 characters.',
  }),
  skills: z.string().min(5, {
    message: 'Skills must be at least 5 characters.',
  }),
  experience: z.string().min(10, {
    message: 'Experience must be at least 10 characters.',
  }),
  education: z.string().min(10, {
    message: 'Education must be at least 10 characters.',
  }),
  avatarUrl: z.string().optional(),
})

// Default values that will be overridden by API data
const defaultValues = {
  aboutTitle: "About Me",
  aboutDescription: "I'm a passionate developer with experience in building web applications using modern technologies. I enjoy solving complex problems and creating intuitive user experiences.",
  heading: "Hi, I'm Your Name",
  skills: "React, Next.js, TypeScript, Node.js, Express, MongoDB, PostgreSQL, Tailwind CSS",
  experience: "Senior Developer at XYZ Company (2020-Present)\nJunior Developer at ABC Corp (2018-2020)",
  education: "Bachelor of Science in Computer Science (2018)\nWeb Development Bootcamp (2017)",
  avatarUrl: "",
}

export default function AdminAboutPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string>("")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  // Fetch about content when component mounts
  useEffect(() => {
    const fetchAboutContent = async () => {
      try {
        const response = await fetch('/api/about')
        if (!response.ok) {
          throw new Error('Failed to fetch about content')
        }
        const data = await response.json()
        
        // Update form with data from API
        form.reset({
          aboutTitle: data.aboutTitle,
          aboutDescription: data.aboutDescription,
          heading: data.heading,
          skills: data.skills,
          experience: data.experience,
          education: data.education,
          avatarUrl: data.avatarUrl || "",
        })
        
        // Set avatar preview if available
        if (data.avatarUrl) {
          setAvatarPreview(data.avatarUrl)
        }
      } catch (error) {
        console.error('Error fetching about content:', error)
        toast.error('Failed to load about page content')
      } finally {
        setIsLoadingData(false)
      }
    }

    fetchAboutContent()
  }, [form])

  // Handle avatar file change
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAvatarFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      // Handle avatar upload if a new file was selected
      let avatarUrl = values.avatarUrl
      
      if (avatarFile) {
        // Create a FormData object to upload the file
        const formData = new FormData()
        formData.append('file', avatarFile)
        
        // Upload the avatar image
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })
        
        if (!uploadResponse.ok) {
          throw new Error('Failed to upload avatar image')
        }
        
        const uploadData = await uploadResponse.json()
        avatarUrl = uploadData.url // Get the URL of the uploaded image
      }
      
      // Save to the database via API
      const response = await fetch('/api/about', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...values,
          avatarUrl, // Include the avatar URL in the data
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update about content')
      }
      
      toast.success('About page content updated successfully')
    } catch (error) {
      toast.error('Failed to update about page content')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Container>
      <div className="py-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Edit About Page</h1>
          <Button variant="outline" onClick={() => router.push('/admin/dashboard')}>
            Back to Dashboard
          </Button>
        </div>

        <div className="max-w-2xl mx-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="aboutTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>About Title</FormLabel>
                    <FormControl>
                      <Input placeholder="About Me" {...field} />
                    </FormControl>
                    <FormDescription>
                      The main heading for your about page.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="heading"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Personal Heading</FormLabel>
                    <FormControl>
                      <Input placeholder="Hi, I'm Your Name" {...field} />
                    </FormControl>
                    <FormDescription>
                      The personal greeting heading that appears on your about page.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="aboutDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>About Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Write about yourself, your background, and your interests" 
                        className="min-h-32" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      The main paragraph describing you and your background.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="skills"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Skills</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="List your technical skills, separated by commas" 
                        className="min-h-20" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      List your technical skills and technologies you're proficient in.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Experience</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="List your work experience, one entry per line" 
                        className="min-h-32" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      List your work experience, with each position on a new line.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="education"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Education</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="List your education, one entry per line" 
                        className="min-h-32" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      List your educational background, with each entry on a new line.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="avatarUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Avatar Image</FormLabel>
                    <FormControl>
                      <Input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleAvatarChange} 
                        className="mb-2"
                      />
                    </FormControl>
                    {avatarPreview && (
                      <div className="mt-4 relative w-40 h-40 avatar-container admin-avatar-preview">
                        <Image 
                          src={avatarPreview} 
                          alt="Avatar Preview" 
                          fill 
                          style={{ objectFit: 'cover' }} 
                          className="rounded-2xl"
                        />
                      </div>
                    )}
                    <FormDescription>
                      Upload an image for your profile (optional).
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
      </div>
    </Container>
  )
}

// Add styles for the avatar preview
const styles = `
  .admin-avatar-preview {
    border-radius: 1rem; /* Corresponds to rounded-2xl */
    padding: 2px; /* Border thickness */
    position: relative;
    overflow: hidden; /* Ensures the pseudo-element stays within bounds */
  }
  .admin-avatar-preview::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 1rem; /* Match parent's border-radius */
    padding: 2px; /* Border thickness, must match parent's padding */
    background: linear-gradient(60deg, #f79533, #f37055, #ef4e7b, #a166ab, #5073b8, #1098ad, #07b39b, #6fba82);
    -webkit-mask: 
      linear-gradient(#fff 0 0) content-box, 
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: destination-out; 
    mask-composite: exclude; 
    animation: borderAnimation 4s linear infinite;
    z-index: 0; /* Place it behind the image, but above background */
  }
  .admin-avatar-preview img {
    border-radius: calc(1rem - 2px); /* Adjust inner image radius to account for border */
    position: relative; /* Ensure image is above the pseudo-element */
    z-index: 1;
  }

  @keyframes borderAnimation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

// Inject styles into the head
if (typeof window !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}