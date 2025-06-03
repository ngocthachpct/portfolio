'use client'

import { Container } from '@/components/container'
import Link from 'next/link'

export default function AdminDashboard() {
  return (
    <Container>
      <div className="py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">Manage your portfolio content</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DashboardCard
            title="Home Page"
            description="Edit your homepage content"
            link="/admin/home"
          />
          <DashboardCard
            title="About Page"
            description="Update your about page information"
            link="/admin/about"
          />
          <DashboardCard
            title="Projects"
            description="Manage your projects"
            link="/admin/projects"
          />
          <DashboardCard
            title="Blog Posts"
            description="Create and edit blog posts"
            link="/admin/blog"
          />
          <DashboardCard
            title="Contact & Connect"
            description="Manage contact info and view messages"
            link="/admin/contact"
          />
        </div>
      </div>
    </Container>
  )
}

function DashboardCard({ title, description, link }: { title: string; description: string; link: string }) {
  return (
    <Link href={link} className="block">
      <div className="border rounded-lg p-6 hover:shadow-md transition-shadow dark:bg-gray-800/50 dark:border-gray-700 hover:border-primary/50">
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p className="text-gray-500 dark:text-gray-400">{description}</p>
      </div>
    </Link>
  )
}