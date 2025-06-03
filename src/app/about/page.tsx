import { Container } from "@/components/container";
import { Section } from "@/components/section";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { prisma } from "@/lib/db";
import Image from "next/image";

export const metadata = {
  title: "About | Portfolio",
  description: "Learn more about my skills, experience, and background.",
};

async function getAboutContent() {
  // Get the first about content record or create a default one if none exists
  let aboutContent = await prisma.aboutContent.findFirst();

  if (!aboutContent) {
    // Create default about content if none exists
    aboutContent = await prisma.aboutContent.create({
      data: {
        aboutTitle: "About Me",
        aboutDescription: "I'm a passionate developer with experience in building web applications using modern technologies. I enjoy solving complex problems and creating intuitive user experiences.",
        heading: "Hi, I'm Your Name",
        skills: "React, Next.js, TypeScript, Node.js, Express, MongoDB, PostgreSQL, Tailwind CSS",
        experience: "Senior Developer at XYZ Company (2020-Present)\nJunior Developer at ABC Corp (2018-2020)",
        education: "Bachelor of Science in Computer Science (2018)\nWeb Development Bootcamp (2017)",
      },
    });
  }

  return aboutContent;
}

export default async function AboutPage() {
  const aboutContent = await getAboutContent();

  // Parse skills into an array
  const skillsList = aboutContent.skills.split(',').map(skill => skill.trim());

  // Split skills into categories (for demonstration)
  const frontendSkills = skillsList.filter(skill =>
    ['React', 'Next.js', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'Tailwind'].some(tech =>
      skill.includes(tech)
    )
  );

  const backendSkills = skillsList.filter(skill =>
    ['Node', 'Express', 'MongoDB', 'PostgreSQL', 'SQL', 'API'].some(tech =>
      skill.includes(tech)
    )
  );

  const otherSkills = skillsList.filter(skill =>
    !frontendSkills.includes(skill) && !backendSkills.includes(skill)
  );

  // Parse experience and education into arrays
  const experienceItems = aboutContent.experience.split('\n')
    .filter(item => item.trim().length > 0)
    .map(item => {
      const parts = item.split('(');
      const title = parts[0].trim();
      const periodMatch = item.match(/\((.*?)\)/);
      const period = periodMatch ? periodMatch[1] : '';
      const company = title.split(' at ')[1] || 'Company';
      const role = title.split(' at ')[0] || title;
      return { title: role, company, period, description: '' };
    });

  const educationItems = aboutContent.education.split('\n')
    .filter(item => item.trim().length > 0)
    .map(item => {
      const parts = item.split('(');
      const degree = parts[0].trim();
      const periodMatch = item.match(/\((.*?)\)/);
      const period = periodMatch ? periodMatch[1] : '';
      return { degree, institution: '', period, description: '' };
    });

  return (
    <Container>
      <Section
        title={aboutContent.aboutTitle}
        description={aboutContent.aboutDescription}
      >
        <div className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold">{aboutContent.heading}</h3>
              <p className="text-muted-foreground">
                {aboutContent.aboutDescription}
              </p>
            </div>
            <div className="w-2/3 h-full aspect-square bg-muted rounded-full flex items-center justify-center overflow-hidden">
              {aboutContent.avatarUrl ? (
                <div className="relative w-full h-full">
                  {/* Viền gradient xoay */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-400 via-pink-400 to-purple-600 animate-spin"></div>

                  {/* Ảnh avatar tĩnh bên trong */}
                  <div className="absolute inset-[2px] rounded-full overflow-hidden bg-background">
                    <Image
                      src={aboutContent.avatarUrl}
                      alt="Profile picture"
                      fill
                      style={{ objectFit: 'cover' }}
                      className="rounded-full"
                    />
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">Your Image Here</p>
              )}
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
                  {frontendSkills.length > 0 && (
                    <SkillCard title="Frontend" skills={frontendSkills} />
                  )}
                  {backendSkills.length > 0 && (
                    <SkillCard title="Backend" skills={backendSkills} />
                  )}
                  {otherSkills.length > 0 && (
                    <SkillCard title="Tools & Others" skills={otherSkills} />
                  )}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="experience" className="space-y-6 pt-6">
              <div className="space-y-6">
                {experienceItems.map((item, index) => (
                  <ExperienceItem
                    key={index}
                    title={item.title}
                    company={item.company}
                    period={item.period}
                    description={item.description || "Worked on various projects and contributed to the company's success."}
                  />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="education" className="space-y-6 pt-6">
              <div className="space-y-6">
                {educationItems.map((item, index) => (
                  <EducationItem
                    key={index}
                    degree={item.degree}
                    institution={item.institution || "University"}
                    period={item.period}
                    description={item.description || "Studied and gained knowledge in various subjects related to the field."}
                  />
                ))}
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