import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react";
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
  content: string;
};

// This would typically come from a CMS or MDX files
const blogPosts: Record<string, BlogPost> = {
  "getting-started-with-nextjs-14": {
    id: "post-1",
    title: "Getting Started with Next.js 14",
    description:
      "Learn how to set up a new Next.js 14 project with the App Router and explore its new features and improvements.",
    date: "2023-12-15",
    readingTime: "5 min read",
    category: "Development",
    tags: ["Next.js", "React", "Web Development"],
    slug: "getting-started-with-nextjs-14",
    content: `
# Getting Started with Next.js 14

Next.js 14 introduces several new features and improvements that make it even more powerful for building modern web applications. In this article, we'll explore how to set up a new Next.js 14 project and take advantage of its new capabilities.

## Setting Up a New Project

To create a new Next.js 14 project, you can use the following command:

\`\`\`bash
npx create-next-app@latest my-next-app
\`\`\`

During the setup, you'll be prompted to choose various options, such as whether to use TypeScript, ESLint, Tailwind CSS, and more. Select the options that best suit your project requirements.

## Key Features in Next.js 14

### 1. Improved App Router

The App Router, introduced in Next.js 13, has been further refined in version 14. It provides a more intuitive way to handle routing in your application, with support for nested layouts, loading states, and error boundaries.

### 2. Server Components

Next.js 14 continues to build on React Server Components, allowing you to render components on the server for improved performance and reduced client-side JavaScript.

### 3. Turbopack (Beta)

Turbopack, a Rust-based successor to Webpack, is still in beta but offers significantly faster development experience with improved hot module replacement.

### 4. Enhanced Image Optimization

The Image component has been improved for better performance and user experience, with support for new formats and optimization techniques.

## Building Your First Page

With Next.js 14, you can create pages using either the Pages Router or the App Router. Here's an example of a simple page using the App Router:

\`\`\`tsx
// app/page.tsx
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">Welcome to Next.js 14!</h1>
      <p className="text-xl">Get started by editing app/page.tsx</p>
    </main>
  );
}
\`\`\`

## Conclusion

Next.js 14 builds upon the solid foundation of previous versions, offering improved performance, developer experience, and new features. Whether you're building a simple website or a complex web application, Next.js 14 provides the tools and capabilities you need to create fast, scalable, and maintainable web applications.

Start exploring Next.js 14 today and take your web development skills to the next level!
    `,
  },
  "building-design-system-with-tailwind": {
    id: "post-2",
    title: "Building a Design System with Tailwind CSS",
    description:
      "Discover how to create a consistent and scalable design system using Tailwind CSS and shadcn/ui components.",
    date: "2023-11-28",
    readingTime: "8 min read",
    category: "Design",
    tags: ["Tailwind CSS", "Design System", "UI/UX"],
    slug: "building-design-system-with-tailwind",
    content: `
# Building a Design System with Tailwind CSS

A well-crafted design system is essential for maintaining consistency across your applications and websites. In this article, we'll explore how to build a comprehensive design system using Tailwind CSS and shadcn/ui components.

## What is a Design System?

A design system is a collection of reusable components, guided by clear standards, that can be assembled to build any number of applications. It typically includes:

- Design principles
- UI components
- Color palettes
- Typography scales
- Spacing systems
- Documentation

## Setting Up Tailwind CSS

First, let's set up Tailwind CSS in your project:

\`\`\`bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
\`\`\`

Configure your tailwind.config.js file to extend the default theme with your design tokens:

\`\`\`js
// tailwind.config.js
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          // ... other shades
          900: '#0c4a6e',
        },
        // ... other color scales
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      spacing: {
        // Custom spacing scale
      },
      borderRadius: {
        // Custom border radius scale
      },
    },
  },
  plugins: [],
}
\`\`\`

## Integrating shadcn/ui Components

shadcn/ui provides a collection of accessible and customizable components that work seamlessly with Tailwind CSS. To add shadcn/ui to your project:

\`\`\`bash
npx shadcn-ui@latest init
\`\`\`

This will set up the necessary configuration files and create a components directory for your shadcn/ui components.

## Creating Component Variants

One of the powerful features of Tailwind CSS is the ability to create component variants using the class-variance-authority package:

\`\`\`tsx
import { cva, type VariantProps } from 'class-variance-authority'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'underline-offset-4 hover:underline text-primary',
      },
      size: {
        default: 'h-10 py-2 px-4',
        sm: 'h-9 px-3 rounded-md',
        lg: 'h-11 px-8 rounded-md',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)
\`\`\`

## Documentation with Storybook

To document your design system, consider using Storybook:

\`\`\`bash
npx storybook init
\`\`\`

Create stories for each of your components to showcase their variants and usage examples.

## Conclusion

Building a design system with Tailwind CSS and shadcn/ui provides a powerful foundation for creating consistent, accessible, and maintainable user interfaces. By defining clear design tokens, creating reusable components, and documenting your system, you can streamline your development process and ensure consistency across your applications.

Remember that a good design system evolves over time, so regularly review and refine your components and design tokens based on feedback and changing requirements.
    `,
  },
  "creating-animations-with-framer-motion": {
    id: "post-3",
    title: "Creating Smooth Animations with Framer Motion",
    description:
      "Learn how to add beautiful animations to your React applications using Framer Motion, with practical examples.",
    date: "2023-10-20",
    readingTime: "6 min read",
    category: "Development",
    tags: ["Framer Motion", "React", "Animations"],
    slug: "creating-animations-with-framer-motion",
    content: `
# Creating Smooth Animations with Framer Motion

Adding animations to your React applications can significantly enhance the user experience. Framer Motion is a powerful library that makes it easy to create smooth, physics-based animations. In this article, we'll explore how to use Framer Motion to add beautiful animations to your React components.

## Getting Started with Framer Motion

First, install Framer Motion in your React project:

\`\`\`bash
npm install framer-motion
\`\`\`

## Basic Animations

Let's start with a simple animation. The \`motion\` component is the core of Framer Motion. It's a component that can animate any HTML or SVG element:

\`\`\`tsx
import { motion } from 'framer-motion';

function FadeIn() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      Hello, Framer Motion!
    </motion.div>
  );
}
\`\`\`

## Animating on Scroll

You can trigger animations when elements come into view using the \`useInView\` hook:

\`\`\`tsx
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

function ScrollAnimation() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5 }}
    >
      This element animates when it comes into view!
    </motion.div>
  );
}
\`\`\`

## Staggered Animations

You can create staggered animations for lists of items using Framer Motion's \`staggerChildren\` property:

\`\`\`tsx
import { motion } from 'framer-motion';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

function StaggeredList() {
  return (
    <motion.ul
      variants={container}
      initial="hidden"
      animate="show"
    >
      {[1, 2, 3, 4, 5].map((index) => (
        <motion.li key={index} variants={item}>
          Item {index}
        </motion.li>
      ))}
    </motion.ul>
  );
}
\`\`\`

## Gesture Animations

Framer Motion makes it easy to add animations that respond to user gestures like hover, tap, and drag:

\`\`\`tsx
import { motion } from 'framer-motion';

function GestureAnimation() {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      Click me!
    </motion.button>
  );
}
\`\`\`

## Page Transitions

You can create smooth page transitions in Next.js using Framer Motion's \`AnimatePresence\` component:

\`\`\`tsx
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';

function Layout({ children }) {
  const router = useRouter();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={router.route}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
\`\`\`

## Conclusion

Framer Motion provides a powerful and intuitive API for creating smooth animations in React applications. By using the techniques described in this article, you can enhance your user interfaces with beautiful animations that improve the overall user experience.

Remember to use animations purposefully and avoid overusing them, as excessive animations can be distracting and may negatively impact performance. When used appropriately, animations can guide users' attention, provide feedback, and make your application feel more polished and professional.
    `,
  },
  "optimizing-performance-nextjs": {
    id: "post-4",
    title: "Optimizing Performance in Next.js Applications",
    description:
      "Explore techniques and best practices for optimizing the performance of your Next.js applications.",
    date: "2023-09-15",
    readingTime: "10 min read",
    category: "Performance",
    tags: ["Next.js", "Performance", "Web Development"],
    slug: "optimizing-performance-nextjs",
    content: `
# Optimizing Performance in Next.js Applications

Performance is a critical aspect of web development that directly impacts user experience and business metrics. Next.js provides several built-in features and optimizations to help you build high-performance applications. In this article, we'll explore various techniques and best practices for optimizing the performance of your Next.js applications.

## Image Optimization

Next.js includes a built-in Image component that automatically optimizes images for performance:

\`\`\`tsx
import Image from 'next/image';

function OptimizedImage() {
  return (
    <Image
      src="/profile.jpg"
      alt="Profile Picture"
      width={500}
      height={300}
      priority
    />
  );
}
\`\`\`

The Image component automatically:
- Optimizes images on-demand
- Resizes images to avoid shipping large images to small devices
- Lazy loads images by default (unless priority is set)
- Serves images in modern formats like WebP when the browser supports it

## Code Splitting

Next.js automatically splits your code into small chunks, loading only what's necessary for the current page. You can further optimize this with dynamic imports:

\`\`\`tsx
import dynamic from 'next/dynamic';

const DynamicComponent = dynamic(() => import('../components/heavy-component'), {
  loading: () => <p>Loading...</p>,
  ssr: false, // Disable server-side rendering if not needed
});

function MyPage() {
  return (
    <div>
      <h1>My Page</h1>
      <DynamicComponent />
    </div>
  );
}
\`\`\`

## Server Components

Next.js 13+ introduces React Server Components, which can significantly improve performance by reducing the amount of JavaScript sent to the client:

\`\`\`tsx
// app/page.tsx (Server Component by default)
export default async function Page() {
  const data = await fetchData(); // This runs on the server
  
  return (
    <main>
      <h1>Server Component Example</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </main>
  );
}
\`\`\`

## Static Site Generation (SSG)

For pages that don't require real-time data, use Static Site Generation to pre-render pages at build time:

\`\`\`tsx
// pages/blog/[slug].js
export async function getStaticPaths() {
  const posts = await getAllPostSlugs();
  
  return {
    paths: posts.map((post) => ({
      params: { slug: post.slug },
    })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const post = await getPostBySlug(params.slug);
  
  return {
    props: { post },
    revalidate: 3600, // Revalidate every hour (ISR)
  };
}
\`\`\`

## Incremental Static Regeneration (ISR)

ISR allows you to update static pages after they've been built without rebuilding the entire site:

\`\`\`tsx
export async function getStaticProps() {
  const products = await fetchProducts();
  
  return {
    props: { products },
    revalidate: 60, // Regenerate page every 60 seconds if requested
  };
}
\`\`\`

## Font Optimization

Next.js 13+ includes automatic font optimization:

\`\`\`tsx
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  );
}
\`\`\`

## Bundle Analysis

Use the @next/bundle-analyzer package to analyze your bundle size:

\`\`\`bash
npm install --save-dev @next/bundle-analyzer
\`\`\`

\`\`\`js
// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // Your Next.js config
});
\`\`\`

Then run:

\`\`\`bash
ANALYZE=true npm run build
\`\`\`

## Conclusion

Optimizing performance in Next.js applications involves leveraging built-in features like Image optimization, code splitting, and Server Components, as well as implementing best practices like Static Site Generation and Incremental Static Regeneration.

Remember that performance optimization is an ongoing process. Regularly measure your application's performance using tools like Lighthouse, WebPageTest, and Core Web Vitals, and make improvements based on the results.

By following these techniques and best practices, you can create Next.js applications that load quickly, respond promptly to user interactions, and provide an excellent user experience across all devices and network conditions.
    `,
  },
};

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = blogPosts[params.slug];

  if (!post) {
    return {
      title: "Blog Post Not Found",
    };
  }

  return {
    title: `${post.title} | Portfolio Blog`,
    description: post.description,
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogPosts[params.slug];

  if (!post) {
    return (
      <Container>
        <div className="py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">Blog Post Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The blog post you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link href="/blog">Back to Blog</Link>
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="max-w-3xl mx-auto py-10">
        <div className="mb-8">
          <Button asChild variant="ghost" className="mb-4">
            <Link href="/blog" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
            </Link>
          </Button>

          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{post.readingTime}</span>
            </div>
            <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
              {post.category}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
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

          <Separator className="my-6" />
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          {/* In a real app, you would use MDX or a rich text renderer here */}
          <div dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br>') }} />
        </div>
      </div>
    </Container>
  );
}