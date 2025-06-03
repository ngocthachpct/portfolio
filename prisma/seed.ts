import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create home content
  const existingHomeContent = await prisma.homeContent.findFirst();
  
  let homeContent;
  if (!existingHomeContent) {
    homeContent = await prisma.homeContent.create({
      data: {
        title: "Hi, I'm Your Name",
        subtitle: "Full Stack Developer",
        description: "I create beautiful, responsive, and user-friendly websites and applications using modern technologies like Next.js, React, and Tailwind CSS.",
      },
    });
    console.log('Created home content:', homeContent);
  } else {
    console.log('Home content already exists');
    homeContent = existingHomeContent;
  }
  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: 'hashed_password_would_go_here', // In a real app, use bcrypt to hash passwords
      role: 'ADMIN',
    },
  });

  console.log('Created admin user:', admin);

  // Create projects
  const projects = [
    {
      title: 'E-commerce Platform',
      description: 'A full-stack e-commerce platform built with Next.js, TypeScript, and Stripe for payments.',
      imageUrl: '/placeholder.jpg',
      liveUrl: 'https://example.com/demo',
      githubUrl: 'https://github.com/yourusername/ecommerce',
      userId: admin.id,
    },
    {
      title: 'Task Management App',
      description: 'A task management application with drag-and-drop functionality and real-time updates.',
      imageUrl: '/placeholder.jpg',
      liveUrl: 'https://example.com/demo',
      githubUrl: 'https://github.com/yourusername/task-manager',
      userId: admin.id,
    },
    {
      title: 'Weather Dashboard',
      description: 'A weather dashboard that displays current and forecasted weather data from multiple APIs.',
      imageUrl: '/placeholder.jpg',
      liveUrl: 'https://example.com/demo',
      githubUrl: 'https://github.com/yourusername/weather-app',
      userId: admin.id,
    },
  ];

  for (const project of projects) {
    const createdProject = await prisma.project.create({
      data: project,
    });
    console.log('Created project:', createdProject.title);
  }

  // Create blog posts
  const blogPosts = [
    {
      slug: 'getting-started-with-nextjs',
      title: 'Getting Started with Next.js',
      content: `
# Getting Started with Next.js

Next.js is a React framework that enables server-side rendering, static site generation, and more. It's a great choice for building modern web applications.

## Why Next.js?

- **Server-side rendering**: Improves performance and SEO
- **Static site generation**: Pre-renders pages at build time
- **API routes**: Build API endpoints as part of your Next.js app
- **File-based routing**: Create pages by adding files to the pages directory

## Getting Started

To create a new Next.js app, run the following command:

\`\`\`bash
npx create-next-app my-app
cd my-app
npm run dev
\`\`\`

This will create a new Next.js app and start the development server at http://localhost:3000.
      `,
      coverImage: '/placeholder.jpg',
      published: true,
      userId: admin.id,
      categories: ['Web Development', 'React'],
      tags: ['Next.js', 'React', 'JavaScript', 'Tutorial'],
    },
    {
      slug: 'mastering-typescript',
      title: 'Mastering TypeScript for Frontend Development',
      content: `
# Mastering TypeScript for Frontend Development

TypeScript is a superset of JavaScript that adds static typing to the language. It's a powerful tool for building robust applications.

## Why TypeScript?

- **Type safety**: Catch errors at compile time instead of runtime
- **Better tooling**: Enhanced IDE support with autocompletion and refactoring
- **Improved maintainability**: Self-documenting code with explicit types
- **Gradual adoption**: Can be adopted incrementally in existing JavaScript projects

## Getting Started

To add TypeScript to your project, install it as a dev dependency:

\`\`\`bash
npm install --save-dev typescript @types/react @types/node
\`\`\`

Then create a tsconfig.json file in the root of your project.
      `,
      coverImage: '/placeholder.jpg',
      published: true,
      userId: admin.id,
      categories: ['Web Development', 'TypeScript'],
      tags: ['TypeScript', 'JavaScript', 'Frontend', 'Tutorial'],
    },
    {
      slug: 'building-with-tailwind',
      title: 'Building Beautiful UIs with Tailwind CSS',
      content: `
# Building Beautiful UIs with Tailwind CSS

Tailwind CSS is a utility-first CSS framework that allows you to build custom designs without writing custom CSS.

## Why Tailwind CSS?

- **Utility-first**: Compose designs directly in your markup
- **Responsive**: Built-in responsive design utilities
- **Customizable**: Easily customize the design system to match your brand
- **Performance**: Only include the CSS you actually use in production

## Getting Started

To add Tailwind CSS to your project, install it as a dependency:

\`\`\`bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
\`\`\`
      `,
      coverImage: '/placeholder.jpg',
      published: true,
      userId: admin.id,
      categories: ['Web Development', 'CSS'],
      tags: ['Tailwind CSS', 'CSS', 'UI Design', 'Frontend'],
    },
  ];

  for (const post of blogPosts) {
    const createdPost = await prisma.blogPost.create({
      data: post,
    });
    console.log('Created blog post:', createdPost.title);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });