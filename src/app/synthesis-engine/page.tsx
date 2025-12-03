
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { BrainCircuit, ClipboardList, Database, Sparkles, UserCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const steps = [
  { icon: ClipboardList, title: "1. Your Contextual Input", description: "You provide your list of medications, personal health context (age, conditions, allergies), and any specific food or supplement queries." },
  { icon: Database, title: "2. Foundation Data Cross-Reference", description: "We instantly check your inputs against established pharmacological databases like DrugBank for known, documented interactions." },
  { icon: BrainCircuit, title: "3. Proprietary ML Analysis", description: "Our custom-trained machine learning models analyze the data to identify potential, novel, or nuanced interactions that aren't in standard databases." },
  { icon: Sparkles, title: "4. AI-Powered Synthesis", description: "The powerful Gemini LLM from Google synthesizes all this data into a clear, easy-to-understand report, explaining the 'why' behind each potential interaction." },
  { icon: UserCheck, title: "5. Clinician-Reviewed Framework", description: "Our entire process and the AI's behavior are guided and constantly reviewed by our board of expert MDs and PharmDs to ensure safety and accuracy." }
];

export default function SynthesisEnginePage() {
  const bgImage = PlaceHolderImages.find(p => p.id === 'synthesis-engine-bg');

  return (
    <div>
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center text-center text-white overflow-hidden">
        {bgImage && (
          <Image
            src={bgImage.imageUrl}
            alt="Synthesis Engine Background"
            fill
            className="object-cover -z-20"
            data-ai-hint={bgImage.imageHint}
            priority
          />
        )}
        <div className="absolute inset-0 bg-black/60 -z-10"></div>
        <div className="container px-4">
          <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-6xl text-shadow-lg">
            The Synthesis Engine
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-lg leading-8 text-white/80 text-shadow">
            Nexus-Med doesn't just check a list. We synthesize multiple layers of data to create a contextual, intelligent, and personalized safety report. Here's how.
          </p>
        </div>
      </section>

      <section className="py-24 sm:py-32">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="text-center">
            <h2 className="font-headline text-3xl font-bold sm:text-4xl">
              From Data Points to Actionable Insights
            </h2>
            <p className="mt-4 text-lg text-foreground/70">
              Our five-step process transforms your raw information into a comprehensive analysis in seconds.
            </p>
          </div>

          <div className="mt-20 space-y-16">
            {steps.map((step) => (
              <Card key={step.title} className="overflow-hidden border-border bg-card shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-12">
                   <div className="md:col-span-1 bg-primary/10 flex items-center justify-center p-6">
                     <step.icon className="h-10 w-10 text-primary" />
                   </div>
                   <div className="md:col-span-11 p-6 md:p-8">
                     <h3 className="font-headline text-2xl font-semibold text-primary">{step.title}</h3>
                     <p className="mt-2 text-foreground/80 leading-relaxed">{step.description}</p>
                   </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
