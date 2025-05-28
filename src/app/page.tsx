import { Container } from "@/components/container";
import { Section } from "@/components/section";
import { Button } from "@/components/ui/button";
import { TypewriterEffect } from "@/components/ui/typewriter-effect";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const words = [
    { text: "Full-Stack" },
    { text: "Developer" },
    { text: "with" },
    { text: "passion" },
    { text: "for" },
    { text: "building" },
    { text: "modern" },
    { text: "web" },
    { text: "applications." },
  ];

  return (
    <>
      <Container>
        <Section className="py-24 md:py-32 lg:py-40 flex flex-col items-center justify-center text-center space-y-10">
          <div className="space-y-6 max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              Hi, I'm <span className="text-primary">Your Name</span>
            </h1>
            <div className="h-16">
              <TypewriterEffect words={words} className="text-2xl md:text-3xl" />
            </div>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              I create beautiful, responsive, and user-friendly websites and applications
              using modern technologies like Next.js, React, and Tailwind CSS.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="rounded-full">
                <Link href="/projects">
                  View My Work <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full">
                <Link href="/contact">Get In Touch</Link>
              </Button>
            </div>
          </div>
        </Section>
      </Container>
    </>
  );
}
