import { Container } from '@/components/container'
import { ProjectCard } from '@/components/project-card'
import { prisma } from '@/lib/db'

export const revalidate = 60 // revalidate this page every 60 seconds

export default async function ProjectsPage() {
  // Fetch projects from the database
  const projects = await prisma.project.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <Container>
      <div className="py-10">
        <h1 className="text-3xl font-bold mb-8">Projects</h1>
        
        {projects.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground">No projects found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                title={project.title}
                description={project.description}
                imageUrl={project.imageUrl}
                githubUrl={project.githubUrl || ''}
                liveUrl={project.liveUrl || ''}
              />
            ))}
          </div>
        )}
      </div>
    </Container>
  )
}