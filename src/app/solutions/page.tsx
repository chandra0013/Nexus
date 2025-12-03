import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Code, FileStack, Users, Hospital, Pill, Monitor } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';


const targetUsers = [
  {
    icon: Hospital,
    title: 'Health Systems & EMRs',
    description: "Integrate contextual safety alerts directly into clinical workflows, reducing alert fatigue and improving patient outcomes at scale.",
  },
  {
    icon: Pill,
    title: 'Pharmacists',
    description: 'Go beyond standard interaction checks during medication reviews with nuanced, context-aware insights that account for patient-specific factors.',
  },
  {
    icon: Monitor,
    title: 'Telehealth Platforms',
    description: 'Empower your providers with a best-in-class safety tool, enhancing the quality of remote care and patient trust.',
  },
]

const features = [
  {
    icon: Code,
    title: 'Robust & Simple API',
    description: 'Our well-documented REST API allows for quick and seamless integration into any existing system, from EMRs to patient-facing apps.',
    href: '/developer-hub',
    cta: 'View API Docs',
  },
  {
    icon: Users,
    title: 'Patient Profile Management',
    description: 'Manage and persist health contexts for multiple patients, enabling continuous and efficient monitoring for clinicians and caregivers.',
    href: '#',
    cta: 'Learn More',
  },
  {
    icon: FileStack,
    title: 'Bulk Analysis Capabilities',
    description: 'Analyze entire patient cohorts for potential medication risks, perfect for population health management and clinical research.',
    href: '#',
    cta: 'Learn More',
  }
]

export default function SolutionsPage() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'solutions-hero');

  return (
    <div>
      <section className="relative h-[60vh] min-h-[500px] flex items-center text-white overflow-hidden">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt="Modern hospital interior"
            fill
            className="object-cover -z-20"
            data-ai-hint={heroImage.imageHint}
            priority
          />
        )}
        <div className="absolute inset-0 bg-primary/40 bg-gradient-to-tr from-black/80 to-transparent -z-10"></div>
        <div className="container px-4">
          <div className="max-w-2xl">
            <h1 className="font-headline text-4xl font-bold tracking-tight text-shadow-lg sm:text-6xl">
              Powering the Future of Clinical Care
            </h1>
            <p className="mt-6 text-lg leading-8 text-white/90 text-shadow">
              Integrate Nexus-Med’s contextual intelligence engine into your platform to provide a new standard of medication safety.
            </p>
            <Button
              size="lg"
              className="mt-10 animate-pulse-glow rounded-full bg-accent px-8 py-7 text-lg font-bold text-accent-foreground shadow-lg shadow-accent/20 transition-all hover:bg-accent/90 hover:shadow-accent/40"
            >
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      <section className="py-24 sm:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-headline text-3xl font-bold sm:text-4xl">
              A Tool for Every Professional
            </h2>
            <p className="mt-4 text-lg text-foreground/70">
              Nexus-Med is designed to augment clinical decision-making across the healthcare ecosystem.
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            {targetUsers.map(user => (
              <Card key={user.title} className="text-center">
                <CardHeader>
                  <div className="mx-auto w-fit rounded-full bg-primary/10 p-4 text-primary">
                    <user.icon className="h-8 w-8" />
                  </div>
                </CardHeader>
                <CardContent>
                  <h3 className="font-headline text-xl font-semibold">{user.title}</h3>
                  <p className="mt-2 text-sm text-foreground/60">{user.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

       <section className="bg-card/50 py-24 sm:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-headline text-3xl font-bold sm:text-4xl">
              Features Built for Scale and Integration
            </h2>
            <p className="mt-4 text-lg text-foreground/70">
              Our enterprise-grade features are built for security, reliability, and ease of use.
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            {features.map(feature => (
              <Card key={feature.title} className="flex flex-col">
                <CardHeader>
                  <div className="bg-primary/10 text-primary p-3 rounded-full w-fit">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <CardTitle className="font-headline pt-2">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-foreground/70">{feature.description}</p>
                </CardContent>
                <div className="p-6 pt-0">
                  <Button asChild variant="outline" className="w-full">
                    <Link href={feature.href}>{feature.cta}</Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
