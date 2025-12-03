import { AlertTriangle, Fingerprint, Lock, FileText, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const principles = [
  {
    icon: ShieldCheck,
    title: 'Medical Disclaimer',
    text: "Nexus-Med is a powerful informational tool, but it is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay in seeking it because of something you have read on Nexus-Med.",
    variant: 'destructive',
  },
  {
    icon: Fingerprint,
    title: 'Data Anonymization & Aggregation',
    text: "Your privacy is fundamental. The personal health context you provide is used only for the duration of your analysis session to generate your report and is not stored permanently with your identity. Any data used for our 'Global Insights' feature is fully anonymized and aggregated, meaning it is stripped of all personal identifiers and combined with thousands of other data points, making it impossible to trace back to an individual.",
    variant: 'default',
  },
  {
    icon: Lock,
    title: 'Data Security',
    text: 'We employ industry-standard security measures to protect your information. All data transmitted between your device and our servers is encrypted using Transport Layer Security (TLS). We are committed to protecting your data from unauthorized access, alteration, disclosure, or destruction.',
    variant: 'default',
  },
  {
    icon: FileText,
    title: 'Our Guiding Principles',
    text: 'We operate on principles of Privacy by Design, User Control, and Transparency. We believe you should have control over your data and a clear understanding of how our technology works. We do not sell your personal data to third parties.',
    variant: 'default',
  },
];


export default function SafetyAndPrivacyPage() {
  return (
    <div className="py-24 sm:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            Your Trust is Our Priority
          </h1>
          <p className="mt-6 text-lg leading-8 text-foreground/70">
            We are committed to the highest standards of user safety, data privacy, and transparency. Here’s what you need to know about how we protect you and your information.
          </p>
        </div>

        <div className="mx-auto mt-20 grid max-w-4xl grid-cols-1 gap-8">
          {principles.map((principle) => (
            <Card key={principle.title} className={principle.variant === 'destructive' ? 'border-accent/50 bg-accent/5' : ''}>
              <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                <div className={`rounded-lg p-3 ${principle.variant === 'destructive' ? 'bg-accent/10 text-accent' : 'bg-primary/10 text-primary'}`}>
                  <principle.icon className="h-6 w-6" />
                </div>
                <CardTitle className={`font-headline text-2xl ${principle.variant === 'destructive' ? 'text-accent' : ''}`}>{principle.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-base leading-relaxed text-foreground/80">
                  {principle.text}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
