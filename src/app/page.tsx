import Link from 'next/link';
import {
  CheckCircle2,
  FlaskConical,
  HeartPulse,
  Lightbulb,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import TiltCard from '@/components/tilt-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const features = [
  {
    icon: <HeartPulse className="size-8 text-primary" />,
    title: 'Full Health Context',
    description:
      "Goes beyond generic checks by integrating your age, allergies, and diagnoses for truly personal insights.",
  },
  {
    icon: <FlaskConical className="size-8 text-primary" />,
    title: 'Advanced AI Synthesis',
    description:
      'Our engine combines data from DrugBank, ML predictions, and the Gemini API to see the full picture.',
  },
  {
    icon: <ShieldCheck className="size-8 text-primary" />,
    title: 'Easy-to-Understand Reports',
    description:
      'Receive clear, actionable reports, not just a list of confusing medical jargon. Clarity is our priority.',
  },
  {
    icon: <Zap className="size-8 text-primary" />,
    title: 'Food & Supplement Analysis',
    description:
      'Analyze potential interactions with specific foods or supplements, a critical factor often overlooked.',
  },
  {
    icon: <Lightbulb className="size-8 text-primary" />,
    title: 'Contextual AI Chatbot',
    description:
      'Ask follow-up questions to our AI, "Synergy," to get deeper explanations about your report.',
  },
  {
    icon: <CheckCircle2 className="size-8 text-primary" />,
    title: 'Clinician Reviewed',
    description:
      'Our AI is guided and constantly reviewed by a board of human PharmDs and MDs, ensuring accuracy and safety.',
  },
];

export default function Home() {
  return (
    <div className="w-full">
      <section className="relative overflow-hidden py-24 md:py-32 lg:py-40">
        <div className="absolute inset-0 -z-10 bg-grid-gray-700/20 [mask-image:linear-gradient(to_bottom,white_20%,transparent_100%)]"></div>
        <div className="container mx-auto px-4 text-center">
          <Badge
            variant="outline"
            className="mb-6 border-primary/50 bg-primary/10 text-primary"
          >
            The Future of Medication Safety is Here
          </Badge>
          <h1 className="animate-blur-in font-headline text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            See the Full Picture.
            <br />
            <span className="text-primary">Beyond the Label.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-3xl animate-blur-in text-lg text-foreground/70 [animation-delay:0.2s] md:text-xl">
            Nexus-Med is the first AI-powered platform that analyzes your
            medications against your unique health context, revealing risks
            that generic checkers miss.
          </p>
          <div className="mt-10 flex animate-blur-in items-center justify-center gap-4 [animation-delay:0.4s]">
            <Button
              asChild
              className="animate-pulse-glow rounded-full bg-accent px-8 py-6 text-lg font-bold text-accent-foreground shadow-lg shadow-accent/20 transition-all hover:bg-accent/90 hover:shadow-accent/40"
            >
              <Link href="/app">Analyze Now</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="rounded-full px-8 py-6 text-lg"
            >
              <Link href="/synthesis-engine">How It Works</Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-headline text-4xl font-bold md:text-5xl">
              Why Nexus-Med is Different
            </h2>
            <p className="mt-4 text-lg text-foreground/70">
              We don't just check for interactions. We synthesize data to give
              you contextual intelligence.
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <TiltCard key={feature.title}>
                <div className="flex h-full flex-col p-8">
                  {feature.icon}
                  <h3 className="mt-6 font-headline text-2xl font-bold">
                    {feature.title}
                  </h3>
                  <p className="mt-2 flex-grow text-foreground/60">
                    {feature.description}
                  </p>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 text-center">
          <div className="mx-auto max-w-3xl">
            <h2 className="font-headline text-4xl font-bold md:text-5xl">
              Trusted by Patients, Built for Professionals
            </h2>
            <p className="mt-4 text-lg text-foreground/70">
              Whether you're managing your own health, caring for a loved one,
              or a clinician seeking better tools, Nexus-Med provides the
              clarity you need.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full"
              >
                <Link href="/solutions">For Professionals</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
