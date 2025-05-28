import { Container } from "@/components/container";
import { Section } from "@/components/section";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const metadata = {
  title: "About | Portfolio",
  description: "Learn more about my skills, experience, and background.",
};

export default function AboutPage() {
  return (
    <Container>
      <Section
        title="About Me"
        description="Learn more about my skills, experience, and background."
      >
        <div className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold">Hi, I'm Your Name</h3>
              <p className="text-muted-foreground">
                I'm a passionate full-stack developer with expertise in building
                modern web applications. I specialize in React, Next.js, and
                TypeScript, and I'm dedicated to creating beautiful,
                user-friendly interfaces with clean, maintainable code.
              </p>
              <p className="text-muted-foreground">
                With a strong foundation in both front-end and back-end
                development, I enjoy tackling complex problems and turning ideas
                into reality. I'm constantly learning and exploring new
                technologies to stay at the forefront of web development.
              </p>
            </div>
            <div className="aspect-square bg-muted rounded-2xl flex items-center justify-center">
              <p className="text-muted-foreground">Your Image Here</p>
            </div>
          </div>

          <Separator />

          <Tabs defaultValue="skills">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="experience">Experience</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
            </TabsList>
            <TabsContent value="skills" className="space-y-6 pt-6">
              <div className="space-y-4">
                <h3 className="text-xl font-bold">Technical Skills</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <SkillCard title="Frontend" skills={["React", "Next.js", "TypeScript", "Tailwind CSS", "HTML/CSS"]} />
                  <SkillCard title="Backend" skills={["Node.js", "Express", "MongoDB", "PostgreSQL", "REST APIs"]} />
                  <SkillCard title="Tools" skills={["Git", "GitHub", "VS Code", "Figma", "Vercel"]} />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="experience" className="space-y-6 pt-6">
              <div className="space-y-6">
                <ExperienceItem
                  title="Senior Frontend Developer"
                  company="Company Name"
                  period="2021 - Present"
                  description="Led the development of modern web applications using React, Next.js, and TypeScript. Implemented responsive designs and improved performance."
                />
                <ExperienceItem
                  title="Web Developer"
                  company="Another Company"
                  period="2018 - 2021"
                  description="Developed and maintained client websites. Collaborated with designers to implement responsive layouts and interactive features."
                />
                <ExperienceItem
                  title="Junior Developer"
                  company="First Company"
                  period="2016 - 2018"
                  description="Assisted in the development of web applications. Gained experience in HTML, CSS, JavaScript, and various frameworks."
                />
              </div>
            </TabsContent>
            <TabsContent value="education" className="space-y-6 pt-6">
              <div className="space-y-6">
                <EducationItem
                  degree="Master's in Computer Science"
                  institution="University Name"
                  period="2014 - 2016"
                  description="Focused on web development and software engineering. Completed thesis on modern JavaScript frameworks."
                />
                <EducationItem
                  degree="Bachelor's in Computer Science"
                  institution="University Name"
                  period="2010 - 2014"
                  description="Studied programming fundamentals, data structures, algorithms, and web development basics."
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </Section>
    </Container>
  );
}

function SkillCard({ title, skills }: { title: string; skills: string[] }) {
  return (
    <div className="bg-card p-4 rounded-2xl border shadow-sm">
      <h4 className="font-medium mb-2">{title}</h4>
      <ul className="space-y-1">
        {skills.map((skill) => (
          <li key={skill} className="text-sm text-muted-foreground">
            {skill}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ExperienceItem({
  title,
  company,
  period,
  description,
}: {
  title: string;
  company: string;
  period: string;
  description: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h4 className="text-lg font-medium">{title}</h4>
          <p className="text-muted-foreground">{company}</p>
        </div>
        <div className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full w-fit">
          {period}
        </div>
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function EducationItem({
  degree,
  institution,
  period,
  description,
}: {
  degree: string;
  institution: string;
  period: string;
  description: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h4 className="text-lg font-medium">{degree}</h4>
          <p className="text-muted-foreground">{institution}</p>
        </div>
        <div className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full w-fit">
          {period}
        </div>
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}