import { Container } from "@/components/container";
import { Section } from "@/components/section";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, Github } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type Project = {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  github?: string;
  demo?: string;
};

const projects: Project[] = [
  {
    id: "project-1",
    title: "E-Commerce Platform",
    description:
      "A full-stack e-commerce platform built with Next.js, React, and Stripe for payments. Features include product listings, cart functionality, user authentication, and order management.",
    image: "/placeholder.jpg",
    tags: ["Next.js", "React", "Tailwind CSS", "Stripe", "MongoDB"],
    github: "https://github.com",
    demo: "https://example.com",
  },
  {
    id: "project-2",
    title: "Task Management App",
    description:
      "A task management application with drag-and-drop functionality, user authentication, and real-time updates. Built with React, Firebase, and Tailwind CSS.",
    image: "/placeholder.jpg",
    tags: ["React", "Firebase", "Tailwind CSS", "DnD Kit"],
    github: "https://github.com",
    demo: "https://example.com",
  },
  {
    id: "project-3",
    title: "Personal Blog",
    description:
      "A blog platform built with Next.js and MDX for content management. Features include categories, tags, search functionality, and a responsive design.",
    image: "/placeholder.jpg",
    tags: ["Next.js", "MDX", "Tailwind CSS", "Vercel"],
    github: "https://github.com",
    demo: "https://example.com",
  },
  {
    id: "project-4",
    title: "Weather Dashboard",
    description:
      "A weather dashboard that displays current weather conditions and forecasts for multiple locations. Built with React, OpenWeather API, and Chart.js.",
    image: "/placeholder.jpg",
    tags: ["React", "API Integration", "Chart.js", "Tailwind CSS"],
    github: "https://github.com",
    demo: "https://example.com",
  },
  {
    id: "project-5",
    title: "Recipe Finder",
    description:
      "A recipe finder application that allows users to search for recipes based on ingredients, dietary restrictions, and meal types. Built with React and Spoonacular API.",
    image: "/placeholder.jpg",
    tags: ["React", "API Integration", "Tailwind CSS"],
    github: "https://github.com",
    demo: "https://example.com",
  },
  {
    id: "project-6",
    title: "Portfolio Website",
    description:
      "A modern portfolio website built with Next.js, Tailwind CSS, and Framer Motion. Features include dark mode, responsive design, and smooth animations.",
    image: "/placeholder.jpg",
    tags: ["Next.js", "Tailwind CSS", "Framer Motion"],
    github: "https://github.com",
    demo: "https://example.com",
  },
];

export default function ProjectsPage() {
  return (
    <Container>
      <Section
        title="Projects"
        description="Explore my latest projects and work. Each project is built with modern technologies and best practices."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </Section>
    </Container>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300 rounded-2xl border">
      <div className="relative aspect-video overflow-hidden bg-muted">
        {/* Replace with actual project images */}
        <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
          Project Image
        </div>
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="flex gap-4">
            {project.github && (
              <Button asChild size="icon" variant="outline" className="rounded-full bg-background/20 backdrop-blur-sm border-white/20 hover:bg-background/30">
                <Link href={project.github} target="_blank" rel="noopener noreferrer">
                  <Github className="h-5 w-5" />
                  <span className="sr-only">GitHub</span>
                </Link>
              </Button>
            )}
            {project.demo && (
              <Button asChild size="icon" variant="outline" className="rounded-full bg-background/20 backdrop-blur-sm border-white/20 hover:bg-background/30">
                <Link href={project.demo} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-5 w-5" />
                  <span className="sr-only">Live Demo</span>
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
      <CardHeader>
        <CardTitle className="text-xl">{project.title}</CardTitle>
        <div className="flex flex-wrap gap-2 mt-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription>{project.description}</CardDescription>
      </CardContent>
      <CardFooter className="flex justify-between">
        {project.github && (
          <Button asChild variant="outline" size="sm">
            <Link href={project.github} target="_blank" rel="noopener noreferrer">
              <Github className="mr-2 h-4 w-4" />
              Code
            </Link>
          </Button>
        )}
        {project.demo && (
          <Button asChild size="sm">
            <Link href={project.demo} target="_blank" rel="noopener noreferrer">
              Live Demo
              <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}