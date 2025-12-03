import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Check } from 'lucide-react';
import Link from 'next/link';

const tiers = [
  {
    name: 'Basic',
    price: '$0',
    frequency: '/forever',
    description: 'For personal, occasional use.',
    features: [
      'Up to 5 medications per analysis',
      'Standard drug interaction checks',
      '1 food query per analysis',
    ],
    cta: 'Start for Free',
    isPopular: false,
  },
  {
    name: 'Premium',
    price: '$9',
    frequency: '/month',
    description: 'For individuals and caregivers managing complex regimens.',
    features: [
      'Unlimited medications per analysis',
      'Full contextual analysis (age, allergies, etc.)',
      'Unlimited food &amp; supplement queries',
      'AI Chatbot "Synergy" access',
      'Digital Medication Card for wallet',
    ],
    cta: 'Go Premium',
    isPopular: true,
  },
  {
    name: 'Professional',
    price: 'Custom',
    frequency: '',
    description: 'For clinicians, pharmacists, and researchers.',
    features: [
      'All Premium features',
      'Patient profile management',
      'Bulk analysis capabilities',
      'API Access for integration',
      'Dedicated support',
    ],
    cta: 'Contact Sales',
    isPopular: false,
  },
];

export default function PricingPage() {
  return (
    <div className="py-24 sm:py-32">
      <div className="container mx-auto px-4 text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
          The Right Plan for Your Needs
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-foreground/70">
          From personal use to enterprise solutions, Nexus-Med offers a plan
          that provides the clarity and safety you require.
        </p>
      </div>

      <div className="container mx-auto mt-20 max-w-5xl">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {tiers.map((tier) => (
            <Card
              key={tier.name}
              className={`relative flex flex-col ${
                tier.isPopular ? 'border-primary shadow-2xl shadow-primary/10' : ''
              }`}
            >
              {tier.isPopular && (
                <div className="absolute top-0 right-4 -translate-y-1/2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                  Most Popular
                </div>
              )}
              <CardHeader>
                <CardTitle className="font-headline text-2xl">{tier.name}</CardTitle>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold tracking-tight">
                    {tier.price}
                  </span>
                  {tier.frequency && (
                    <span className="text-sm text-muted-foreground">
                      {tier.frequency}
                    </span>
                  )}
                </div>
                <CardDescription>{tier.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-3 text-sm">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <Check className="mr-2 mt-1 h-4 w-4 flex-shrink-0 text-primary" />
                      <span className="text-foreground/80">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  asChild
                  className={`w-full rounded-full ${
                    tier.isPopular
                      ? 'animate-pulse-glow bg-accent text-accent-foreground hover:bg-accent/90'
                      : 'bg-primary text-primary-foreground hover:bg-primary/90'
                  }`}
                >
                  <Link href={tier.name === 'Professional' ? '/solutions' : '/app'}>
                    {tier.cta}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
