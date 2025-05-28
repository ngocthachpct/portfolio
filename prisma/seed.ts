import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
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
      demoUrl: 'https://example.com/demo',
      githubUrl: 'https://github.com/yourusername/ecommerce',
      tags: ['Next.js', 'TypeScript', 'Stripe', 'Tailwind CSS'],
      featured: true,
      userId: admin.id,
    },
    {
      title: 'Task Management App',
      description: 'A task management application with drag-and-drop functionality and real-time updates.',
      imageUrl: '/placeholder.jpg',
      demoUrl: 'https://example.com/demo',
      githubUrl: 'https://github.com/yourusername/task-manager',
      tags: ['React', 'Firebase', 'Tailwind CSS', 'DnD'],
      featured: true,
      userId: admin.id,
    },
    {
      title: 'Weather Dashboard',
      description: 'A weather dashboard that displays current and forecasted weather data from multiple APIs.',
      imageUrl: '/placeholder.jpg',
      demoUrl: 'https://example.com/demo',
      githubUrl: 'https://github.com/yourusername/weather-app',
      tags: ['React', 'OpenWeather API', 'Chart.js'],
      featured: false,
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
      description: 'Learn how to build modern web applications with Next.js and React.',
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
      imageUrl: '/placeholder.jpg',
      published: true,
      userId: admin.id,
      categories: ['Web Development', 'React'],
      tags: ['Next.js', 'React', 'JavaScript', 'Tutorial'],
    },
    {
      slug: 'mastering-typescript',
      title: 'Mastering TypeScript for Frontend Development',
      description: 'A comprehensive guide to using TypeScript in your frontend projects.',
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

Then create a tsconfig.json file in the root of your project:

\`\`\`json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve"
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
\`\`\`
      `,
      imageUrl: '/placeholder.jpg',
      published: true,
      userId: admin.id,
      categories: ['Web Development', 'TypeScript'],
      tags: ['TypeScript', 'JavaScript', 'Frontend', 'Tutorial'],
    },
    {
      slug: 'building-with-tailwind',
      title: 'Building Beautiful UIs with Tailwind CSS',
      description: 'Learn how to use Tailwind CSS to build beautiful user interfaces without writing custom CSS.',
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

Then configure your template paths in tailwind.config.js:

\`\`\`js
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
\`\`\`

Finally, add the Tailwind directives to your CSS:

\`\`\`css
@tailwind base;
@tailwind components;
@tailwind utilities;
\`\`\`
      `,
      imageUrl: '/placeholder.jpg',
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