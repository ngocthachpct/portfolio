import { Container } from "@/components/container";
import { Section } from "@/components/section";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Calendar, Clock, Tag } from "lucide-react";
import Link from "next/link";

type BlogPost = {
  id: string;
  title: string;
  description: string;
  date: string;
  readingTime: string;
  category: string;
  tags: string[];
  slug: string;
};

const blogPosts: BlogPost[] = [
  {
    id: "post-1",
    title: "Getting Started with Next.js 14",
    description:
      "Learn how to set up a new Next.js 14 project with the App Router and explore its new features and improvements.",
    date: "2023-12-15",
    readingTime: "5 min read",
    category: "Development",
    tags: ["Next.js", "React", "Web Development"],
    slug: "getting-started-with-nextjs-14",
  },
  {
    id: "post-2",
    title: "Building a Design System with Tailwind CSS",
    description:
      "Discover how to create a consistent and scalable design system using Tailwind CSS and shadcn/ui components.",
    date: "2023-11-28",
    readingTime: "8 min read",
    category: "Design",
    tags: ["Tailwind CSS", "Design System", "UI/UX"],
    slug: "building-design-system-with-tailwind",
  },
  {
    id: "post-3",
    title: "Creating Smooth Animations with Framer Motion",
    description:
      "Learn how to add beautiful animations to your React applications using Framer Motion, with practical examples.",
    date: "2023-10-20",
    readingTime: "6 min read",
    category: "Development",
    tags: ["Framer Motion", "React", "Animations"],
    slug: "creating-animations-with-framer-motion",
  },
  {
    id: "post-4",
    title: "Optimizing Performance in Next.js Applications",
    description:
      "Explore techniques and best practices for optimizing the performance of your Next.js applications.",
    date: "2023-09-15",
    readingTime: "10 min read",
    category: "Performance",
    tags: ["Next.js", "Performance", "Web Development"],
    slug: "optimizing-performance-nextjs",
  },
];

export default function BlogPage() {
  return (
    <Container>
      <Section
        title="Blog"
        description="Read my latest articles and thoughts on web development, design, and more."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {blogPosts.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>
      </Section>
    </Container>
  );
}

function BlogPostCard({ post }: { post: BlogPost }) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-all duration-300 rounded-2xl border">
      <CardHeader>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
            {post.category}
          </span>
        </div>
        <CardTitle className="text-xl">
          <Link
            href={`/blog/${post.slug}`}
            className="hover:text-primary transition-colors"
          >
            {post.title}
          </Link>
        </CardTitle>
        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{post.date}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{post.readingTime}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="line-clamp-3">
          {post.description}
        </CardDescription>
        <div className="flex flex-wrap gap-2 mt-4">
          {post.tags.map((tag) => (
            <div
              key={tag}
              className="flex items-center text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground"
            >
              <Tag className="h-3 w-3 mr-1" />
              {tag}
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild variant="ghost" className="p-0 h-auto">
          <Link
            href={`/blog/${post.slug}`}
            className="flex items-center text-primary font-medium hover:underline"
          >
            Read More <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}