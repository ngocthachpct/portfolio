import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ExternalLink, Github } from 'lucide-react'
import Link from 'next/link'

type ProjectCardProps = {
  title: string
  description: string
  imageUrl: string
  githubUrl?: string
  liveUrl?: string
}

export function ProjectCard({
  title,
  description,
  imageUrl,
  githubUrl,
  liveUrl,
}: ProjectCardProps) {
  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300 rounded-2xl border">
      <div className="relative aspect-video overflow-hidden bg-muted">
        {/* Project image */}
        <div 
          className="w-full h-full bg-cover bg-center" 
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="flex gap-4">
            {githubUrl && (
              <Button asChild size="icon" variant="outline" className="rounded-full bg-background/20 backdrop-blur-sm border-white/20 hover:bg-background/30">
                <Link href={githubUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="h-5 w-5" />
                  <span className="sr-only">GitHub</span>
                </Link>
              </Button>
            )}
            {liveUrl && (
              <Button asChild size="icon" variant="outline" className="rounded-full bg-background/20 backdrop-blur-sm border-white/20 hover:bg-background/30">
                <Link href={liveUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-5 w-5" />
                  <span className="sr-only">Live Demo</span>
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="line-clamp-3">{description}</CardDescription>
      </CardContent>
      <CardFooter className="flex justify-between">
        {githubUrl && (
          <Button asChild variant="outline" size="sm">
            <Link href={githubUrl} target="_blank" rel="noopener noreferrer">
              <Github className="mr-2 h-4 w-4" />
              Code
            </Link>
          </Button>
        )}
        {liveUrl && (
          <Button asChild size="sm">
            <Link href={liveUrl} target="_blank" rel="noopener noreferrer">
              Live Demo
              <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}