
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Apple, Wallet } from 'lucide-react';
import Link from 'next/link';

export default function DigitalCardPage() {
  const iphoneImage = PlaceHolderImages.find(p => p.id === 'digital-card-iphone');
  const androidImage = PlaceHolderImages.find(p => p.id === 'digital-card-android');

  return (
    <div className="overflow-hidden">
      <section className="bg-grid-gray-700/10 py-24 sm:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            Carry Your Context With You
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-foreground/70">
            With Nexus-Med Premium, your essential medication and health
            information is always in your pocket, securely stored in your
            digital wallet.
          </p>
          <Button
            asChild
            size="lg"
            className="mt-8 animate-pulse-glow rounded-full bg-accent px-8 py-6 text-lg font-bold text-accent-foreground shadow-lg shadow-accent/20 transition-all hover:bg-accent/90 hover:shadow-accent/40"
          >
            <Link href="/pricing">Go Premium</Link>
          </Button>
        </div>
      </section>

      <section className="container mx-auto max-w-6xl px-4 py-24">
        <div className="grid grid-cols-1 items-center gap-16 md:grid-cols-2">
          <div className="flex justify-center">
             {iphoneImage && (
              <Image
                src={iphoneImage.imageUrl}
                alt="Nexus-Med digital card on iPhone"
                width={300}
                height={600}
                className="rounded-3xl border-8 border-border shadow-2xl"
                data-ai-hint={iphoneImage.imageHint}
              />
            )}
          </div>
          <div className="md:order-first">
            <h2 className="font-headline text-3xl font-bold tracking-tight text-primary sm:text-4xl">
              Secure, Simple, and Always On-Hand
            </h2>
            <p className="mt-4 text-lg text-foreground/70">
              In an emergency, at a new doctor's appointment, or at the
              pharmacy, provide critical information instantly without needing
              to remember every detail.
            </p>
            <ul className="mt-6 space-y-4">
              <li className="flex items-start gap-3">
                <Apple className="mt-1 h-5 w-5 flex-shrink-0 text-accent" />
                <span>
                  <strong>Apple Wallet:</strong> Add your Nexus-Med card with a
                  single tap after generating a premium report.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Wallet className="mt-1 h-5 w-5 flex-shrink-0 text-accent" />
                <span>
                  <strong>Google Wallet:</strong> Seamless integration for
                  Android users, keeping your info accessible.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-card/50 py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-headline text-3xl font-bold sm:text-4xl">
              How It Works
            </h2>
            <div className="mt-12 grid grid-cols-1 gap-8 text-left md:grid-cols-3">
              <div className="rounded-lg border border-border bg-card p-6">
                <span className="font-headline text-2xl font-bold text-primary">
                  01
                </span>
                <h3 className="mt-2 font-headline text-xl font-semibold">
                  Run a Premium Report
                </h3>
                <p className="mt-2 text-sm text-foreground/60">
                  Generate a report with a Premium account to unlock the wallet
                  feature.
                </p>
              </div>
              <div className="rounded-lg border border-border bg-card p-6">
                <span className="font-headline text-2xl font-bold text-primary">
                  02
                </span>
                <h3 className="mt-2 font-headline text-xl font-semibold">
                  Save to Wallet
                </h3>
                <p className="mt-2 text-sm text-foreground/60">
                  Tap the "Add to Wallet" button on your report summary.
                </p>
              </div>
              <div className="rounded-lg border border-border bg-card p-6">
                <span className="font-headline text-2xl font-bold text-primary">
                  03
                </span>
                <h3 className="mt-2 font-headline text-xl font-semibold">
                  Stay Updated
                </h3>
                <p className="mt-2 text-sm text-foreground/60">
                  Your card can be updated easily whenever your medication or
                  health context changes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
