'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Logo } from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Menu, X, ChevronDown } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const mainNavLinks = [
  { name: 'Checker', href: '/app' },
  { name: 'How It Works', href: '/synthesis-engine' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'For Professionals', href: '/solutions' },
  { name: 'Developer Hub', href: '/developer-hub' },
  { name: 'Cost Tracker', href: '/cost-tracker' },
];

const nexusNavLinks = [
    { name: 'Nexus Reels', href: '/nexus'},
    { name: 'Nexus Pro', href: '/nexus-pro'},
];

const noveltyNavLinks = [
    { name: 'Second Opinion', href: '/second-opinion' },
    { name: 'Pregnancy Navigator', href: '/pregnancy-navigator' },
    { name: 'Travel Health Kit Builder', href: '/travel-health-kit-builder' },
    { name: 'Smart Claims Analyzer', href: '/smart-insurance-claims-pre-analyzer' },
    { name: 'Mental Health Analyzer', href: '/mental-health-analyzer' },
    { name: 'Polypharmacy Assistant', href: '/polypharmacy-assistant' },
    { name: 'Lifestyle Conflict Detector', href: '/lifestyle-conflict-detector' },
    { name: 'Contextual Image Analyzer', href: '/contextual-image-analyzer' },
    { name: 'Behavioral Health Habit Tracker', href: '/behavioral-health-habit-tracker' },
    { name: 'Global Insights', href: '/global-insights'},
    { name: 'User Scenarios', href: '/user-scenarios' },
    { name: 'Knowledge Base', href: '/knowledge-base' },
    { name: 'Meet Synergy', href: '/meet-synergy' },
    { name: 'Digital Card', href: '/digital-card' },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-card/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 max-w-screen-xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Logo className="h-8 w-8 text-primary" />
          <span className="font-headline text-lg font-bold">Nexus-Med</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {mainNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-sm font-medium text-foreground/70 transition-colors hover:text-primary',
                pathname === link.href && 'text-primary'
              )}
            >
              {link.name}
            </Link>
          ))}
           <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-foreground/70 transition-colors hover:text-primary focus:outline-none">
              Nexus <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {nexusNavLinks.map((link) => (
                <DropdownMenuItem key={link.href} asChild>
                  <Link href={link.href}>{link.name}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
           <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-foreground/70 transition-colors hover:text-primary focus:outline-none">
              Novelty <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {noveltyNavLinks.map((link) => (
                <DropdownMenuItem key={link.href} asChild>
                  <Link href={link.href}>{link.name}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        <div className="flex items-center gap-4">
          <Button
            asChild
            className="hidden rounded-full bg-accent text-accent-foreground hover:bg-accent/90 sm:block"
          >
            <Link href="/app">Analyze Now</Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="fixed inset-0 top-16 z-40 bg-background/95 backdrop-blur-sm md:hidden">
          <div className="container mx-auto flex h-full flex-col items-center justify-center gap-8 px-4">
            {[...mainNavLinks, ...nexusNavLinks, ...noveltyNavLinks].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-2xl font-medium text-foreground/80 transition-colors hover:text-primary',
                  pathname === link.href && 'text-primary'
                )}
              >
                {link.name}
              </Link>
            ))}
            <Button
              asChild
              size="lg"
              className="mt-8 w-full max-w-xs rounded-full bg-accent text-accent-foreground hover:bg-accent/90"
            >
              <Link href="/app">Analyze Now</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
