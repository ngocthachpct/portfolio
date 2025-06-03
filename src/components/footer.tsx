'use client';

import Link from "next/link";
import { Separator } from "./ui/separator";
import { useEffect, useState } from "react";

interface ContactInfo {
  email: string;
  phone: string;
  address: string;
  githubUrl: string;
  linkedinUrl: string;
  twitterUrl: string;
  description: string;
}

export function Footer() {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      const response = await fetch('/api/contact-info');
      if (response.ok) {
        const data = await response.json();
        setContactInfo(data);
      }
    } catch (error) {
      console.error('Error fetching contact info:', error);
    }
  };

  // Helper function to ensure URL has protocol
  const ensureProtocol = (url: string) => {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return `https://${url}`;
    }
    return url;
  };

  return (
    <footer className="border-t">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <h3 className="font-bold text-lg">Portfolio</h3>
            <p className="text-muted-foreground text-sm">
              A modern portfolio website showcasing my skills and projects as a
              full-stack developer.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-lg">Links</h3>
            <nav className="flex flex-col gap-2">
              <Link
                href="/"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Home
              </Link>
              <Link
                href="/about"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                About
              </Link>
              <Link
                href="/projects"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Projects
              </Link>
              <Link
                href="/blog"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Blog
              </Link>
              <Link
                href="/contact"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Contact
              </Link>
            </nav>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-lg">Social</h3>
            <nav className="flex flex-col gap-2">
              {contactInfo?.githubUrl && (
                <Link
                  href={ensureProtocol(contactInfo.githubUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  GitHub
                </Link>
              )}
              {contactInfo?.linkedinUrl && (
                <Link
                  href={ensureProtocol(contactInfo.linkedinUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  LinkedIn
                </Link>
              )}
              {contactInfo?.twitterUrl && (
                <Link
                  href={ensureProtocol(contactInfo.twitterUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Twitter
                </Link>
              )}
              {!contactInfo?.githubUrl && !contactInfo?.linkedinUrl && !contactInfo?.twitterUrl && (
                <p className="text-sm text-muted-foreground">
                  Social links will appear here once configured.
                </p>
              )}
            </nav>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Portfolio. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link
              href="/privacy"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}