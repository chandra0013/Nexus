
import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Badge } from '@/components/ui/badge';

const articles = [
  {
    title: "A Deep Dive: Grapefruit and Statins (It's More Than You Think)",
    description:
      "Everyone's heard the warning, but what's really happening at a molecular level? We break down the cytochrome P450 interaction.",
    category: 'Food Interactions',
    imageId: 'knowledge-base-grapefruit',
    href: '#',
  },
  {
    title: 'Why Your Kidney Disease Changes Everything for Metformin',
    description:
      'A perfect example of why personal health context is critical. Learn how renal function impacts metformin safety and efficacy.',
    category: 'Contextual Risks',
    imageId: 'user-scenario-caregiver',
    href: '#',
  },
  {
    title: 'The Top 5 Supplement-Drug Interactions Our ML Model Found',
    description:
      "Beyond the known data, our predictive models are uncovering potential risks in common over-the-counter supplements. Here's what we've found.",
    category: 'AI Discoveries',
    imageId: 'knowledge-base-supplements',
    href: '#',
  },
];

export default function KnowledgeBasePage() {
  return (
    <div className="py-24 sm:py-32">
      <div className="container mx-auto px-4 text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
          The Nexus-Med Knowledge Base
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-foreground/70">
          Driving thought leadership and patient education by using our own
          technology to illustrate complex pharmacologic concepts.
        </p>
      </div>

      <div className="container mx-auto mt-16 max-w-6xl px-4">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => {
            const image = PlaceHolderImages.find(
              (p) => p.id === article.imageId
            );
            return (
              <Link
                href={article.href}
                key={article.title}
                className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-all hover:border-primary/50"
              >
                <div className="overflow-hidden">
                  {image && (
                    <Image
                      src={image.imageUrl}
                      alt={article.title}
                      width={600}
                      height={400}
                      className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      data-ai-hint={image.imageHint}
                    />
                  )}
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <Badge
                    variant={
                      article.category === 'AI Discoveries'
                        ? 'destructive'
                        : 'secondary'
                    }
                    className={`w-fit ${
                      article.category === 'AI Discoveries'
                        ? 'bg-accent text-accent-foreground'
                        : 'bg-primary/10 text-primary'
                    }`}
                  >
                    {article.category}
                  </Badge>
                  <h3 className="mt-4 font-headline text-xl font-semibold text-foreground group-hover:text-primary">
                    {article.title}
                  </h3>
                  <p className="mt-2 flex-grow text-sm text-foreground/60">
                    {article.description}
                  </p>
                  <div className="mt-4 text-sm font-semibold text-primary">
                    Read more &rarr;
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
