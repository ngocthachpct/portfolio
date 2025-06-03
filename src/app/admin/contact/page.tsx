'use client'

import { useState, useEffect } from 'react'
import { Container } from '@/components/container'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { Mail, Phone, MapPin, Github, Linkedin, Twitter, MessageSquare } from 'lucide-react'

interface ContactInfo {
  id: string | null
  email: string
  phone: string
  address: string
  githubUrl: string
  linkedinUrl: string
  twitterUrl: string
  description: string
}

interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string
  message: string
  createdAt: string
}

export default function AdminContactPage() {
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    id: null,
    email: '',
    phone: '',
    address: '',
    githubUrl: '',
    linkedinUrl: '',
    twitterUrl: '',
    description: ''
  })
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    fetchContactInfo()
    fetchContactMessages()
  }, [])

  const fetchContactInfo = async () => {
    try {
      const response = await fetch('/api/contact-info')
      if (response.ok) {
        const data = await response.json()
        setContactInfo(data)
      }
    } catch (error) {
      console.error('Error fetching contact info:', error)
      toast.error('Failed to load contact info')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchContactMessages = async () => {
    try {
      const response = await fetch('/api/contact')
      if (response.ok) {
        const data = await response.json()
        setContactMessages(data)
      }
    } catch (error) {
      console.error('Error fetching contact messages:', error)
      toast.error('Failed to load contact messages')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const response = await fetch('/api/contact-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactInfo),
      })

      if (response.ok) {
        const updatedInfo = await response.json()
        setContactInfo(updatedInfo)
        toast.success('Contact info updated successfully!')
      } else {
        throw new Error('Failed to update contact info')
      }
    } catch (error) {
      console.error('Error updating contact info:', error)
      toast.error('Failed to update contact info')
    } finally {
      setIsSaving(false)
    }
  }

  const deleteMessage = async (messageId: string) => {
    try {
      const response = await fetch(`/api/contact/${messageId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setContactMessages(prev => prev.filter(msg => msg.id !== messageId))
        toast.success('Message deleted successfully!')
      } else {
        throw new Error('Failed to delete message')
      }
    } catch (error) {
      console.error('Error deleting message:', error)
      toast.error('Failed to delete message')
    }
  }

  if (isLoading) {
    return (
      <Container>
        <div className="py-10">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-8"></div>
            <div className="space-y-4">
              <div className="h-10 bg-gray-300 rounded"></div>
              <div className="h-10 bg-gray-300 rounded"></div>
              <div className="h-10 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      </Container>
    )
  }

  return (
    <Container>
      <div className="py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Contact & Connect</h1>
          <p className="text-muted-foreground mt-2">
            Manage your contact information and view messages from visitors
          </p>
        </div>

        <Tabs defaultValue="contact-info" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="contact-info">Contact Information</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>

          <TabsContent value="contact-info">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Contact Information
                </CardTitle>
                <CardDescription>
                  Update your contact details and social media links
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={contactInfo.email}
                        onChange={(e) => setContactInfo(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Phone
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={contactInfo.phone}
                        onChange={(e) => setContactInfo(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Address
                    </Label>
                    <Input
                      id="address"
                      value={contactInfo.address}
                      onChange={(e) => setContactInfo(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="Your location"
                    />
                  </div>

                  <Separator />

                  <h3 className="text-lg font-semibold">Social Links</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="github" className="flex items-center gap-2">
                        <Github className="h-4 w-4" />
                        GitHub URL
                      </Label>
                      <Input
                        id="github"
                        type="url"
                        value={contactInfo.githubUrl}
                        onChange={(e) => setContactInfo(prev => ({ ...prev, githubUrl: e.target.value }))}
                        placeholder="https://github.com/username"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="linkedin" className="flex items-center gap-2">
                        <Linkedin className="h-4 w-4" />
                        LinkedIn URL
                      </Label>
                      <Input
                        id="linkedin"
                        type="url"
                        value={contactInfo.linkedinUrl}
                        onChange={(e) => setContactInfo(prev => ({ ...prev, linkedinUrl: e.target.value }))}
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="twitter" className="flex items-center gap-2">
                        <Twitter className="h-4 w-4" />
                        Twitter URL
                      </Label>
                      <Input
                        id="twitter"
                        type="url"
                        value={contactInfo.twitterUrl}
                        onChange={(e) => setContactInfo(prev => ({ ...prev, twitterUrl: e.target.value }))}
                        placeholder="https://twitter.com/username"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={contactInfo.description}
                      onChange={(e) => setContactInfo(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Brief description about how people can contact you"
                      rows={4}
                    />
                  </div>

                  <Button type="submit" disabled={isSaving} className="w-full md:w-auto">
                    {isSaving ? 'Saving...' : 'Save Contact Info'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Contact Messages ({contactMessages.length})
                </CardTitle>
                <CardDescription>
                  Messages from visitors through your contact form
                </CardDescription>
              </CardHeader>
              <CardContent>
                {contactMessages.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No messages yet. Messages will appear here when visitors contact you.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {contactMessages.map((message) => (
                      <div key={message.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold">{message.name}</h4>
                            <p className="text-sm text-muted-foreground">{message.email}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">
                              {new Date(message.createdAt).toLocaleDateString()}
                            </span>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => deleteMessage(message.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                        <div>
                          <p className="font-medium text-sm mb-1">Subject: {message.subject}</p>
                          <p className="text-sm">{message.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  )
}