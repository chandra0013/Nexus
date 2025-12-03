import Link from 'next/link';
import { Logo } from '@/components/icons';
import { Github, Twitter, Linkedin } from 'lucide-react';

const footerNavs = [
  {
    label: 'Product',
    items: [
      { href: '/app', name: 'Checker App' },
      { href: '/pricing', name: 'Pricing' },
      { href: '/synthesis-engine', name: 'Synthesis Engine' },
      { href: '/global-insights', name: 'Global Insights' },
    ],
  },
  {
    label: 'Company',
    items: [
      { href: '/advisory-board', name: 'Advisory Board' },
      { href: '/safety-and-privacy', name: 'Safety &amp; Privacy' },
      { href: '/user-scenarios', name: 'User Scenarios' },
    ],
  },
  {
    label: 'Developers',
    items: [
      { href: '/developer-hub', name: 'Developer Hub' },
      { href: '/solutions', name: 'For Health Systems' },
      { href: '/knowledge-base', name: 'Knowledge Base' },
    ],
  },
];

const socialLinks = [
  { icon: <Twitter className="h-5 w-5" />, href: '#' },
  { icon: <Github className="h-5 w-5" />, href: '#' },
  { icon: <Linkedin className="h-5 w-5" />, href: '#' },
];

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background/95">
      <div className="container mx-auto max-w-screen-xl px-4 py-12 text-foreground">
        <div className="flex flex-col justify-between gap-10 lg:flex-row">
          <div className="mb-8 max-w-sm lg:mb-0">
            <div className="flex items-center gap-2">
              <Logo className="h-8 w-8 text-primary" />
              <span className="font-headline text-xl font-bold">
                Nexus-Med
              </span>
            </div>
            <p className="mt-4 text-sm text-foreground/60">
              AI-powered contextual medication safety analysis.
            </p>
          </div>
          <nav className="grid flex-1 grid-cols-2 gap-8 sm:grid-cols-3">
            {footerNavs.map((nav) => (
              <div key={nav.label}>
                <h3 className="font-headline font-semibold tracking-wide text-foreground/90">
                  {nav.label}
                </h3>
                <ul className="mt-4 space-y-3">
                  {nav.items.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm text-foreground/60 transition-colors hover:text-primary"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between border-t border-border/50 pt-8 sm:flex-row">
          <p className="text-sm text-foreground/50">
            &copy; {new Date().getFullYear()} Nexus-Med Inc. All rights
            reserved.
          </p>
          <div className="mt-4 flex items-center space-x-4 sm:mt-0">
            {socialLinks.map((link, i) => (
              <Link
                key={i}
                href={link.href}
                className="text-foreground/50 transition-colors hover:text-primary"
              >
                {link.icon}
                <span className="sr-only">Social link</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
