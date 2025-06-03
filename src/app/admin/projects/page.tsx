'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/container'
import { toast } from 'sonner'
import { Pencil, Trash, Plus } from 'lucide-react'

type Project = {
  id: string
  title: string
  description: string
  imageUrl: string
  githubUrl: string
  liveUrl?: string | null
  createdAt: string
}

export default function ProjectsAdminPage() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Fetch projects from the API
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects')
        
        if (!response.ok) {
          throw new Error('Failed to fetch projects')
        }
        
        const data = await response.json()
        setProjects(data)
      } catch (error) {
        console.error('Error fetching projects:', error)
        toast.error('Failed to load projects')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjects()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return
    
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete project')
      }
      
      // Update local state
      setProjects(projects.filter(project => project.id !== id))
      toast.success('Project deleted successfully')
    } catch (error) {
      console.error('Error deleting project:', error)
      toast.error('Failed to delete project')
    }
  }

  return (
    <Container>
      <div className="py-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Manage Projects</h1>
          <Button onClick={() => router.push('/admin/projects/new')}>
            <Plus className="mr-2 h-4 w-4" /> Add New Project
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-10">Loading projects...</div>
        ) : projects.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground mb-4">No projects found</p>
            <Button onClick={() => router.push('/admin/projects/new')}>
              Create Your First Project
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {projects.map((project) => (
              <div 
                key={project.id} 
                className="border rounded-lg p-4 flex justify-between items-center"
              >
                <div>
                  <h2 className="font-semibold text-xl">{project.title}</h2>
                  <p className="text-muted-foreground line-clamp-1">
                    {project.description}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => router.push(`/admin/projects/edit/${project.id}`)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="icon"
                    onClick={() => handleDelete(project.id)}
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