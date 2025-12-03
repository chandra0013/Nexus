
import { CheckCircle2, XCircle, Bot, User } from 'lucide-react';

const canDo = [
  'Explain your report in simpler terms',
  'Define medical and pharmacological terms',
  'Provide general information on drug-food interactions',
  'Clarify the severity of an interaction',
];

const cantDo = [
  'Give medical advice or diagnoses',
  'Change your prescription or tell you to stop a medication',
  'Assess the severity of your personal symptoms',
  'Replace a conversation with your doctor or pharmacist',
];

export default function MeetSynergyPage() {
  return (
    <div>
      <section className="relative overflow-hidden py-24 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-4 inline-block rounded-full bg-primary/10 p-4">
            <Bot className="h-12 w-12 text-primary" />
          </div>
          <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            Ask 'Synergy'. Get Answers.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-foreground/70">
            'Synergy' is your AI health assistant, powered by the Gemini API,
            designed to help you understand your Nexus-Med report.
          </p>
        </div>
      </section>

      <section className="container mx-auto -mt-10 max-w-4xl px-4 pb-24">
        <div className="h-[60vh] max-h-[700px] rounded-lg border border-border bg-card/80 p-4 shadow-2xl backdrop-blur-sm">
          {/* In-page chat demo */}
          <div className="flex h-full flex-col">
            <div className="flex-1 space-y-6 overflow-y-auto p-4">
              {/* Initial message */}
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Bot className="h-5 w-5" />
                </div>
                <div className="flex-1 rounded-lg bg-background/50 px-4 py-3">
                  <p className="text-sm text-foreground/90">
                    Hello! I'm Synergy. I've just analyzed your report. What
                    questions do you have for me? You can try asking one of the
                    questions below.
                  </p>
                </div>
              </div>
              {/* User question */}
              <div className="flex items-start gap-4">
                 <div className="flex-1 rounded-lg bg-accent/20 px-4 py-3 text-right">
                  <p className="text-sm text-foreground/90">
                    Can you explain this warning in simpler terms?
                  </p>
                </div>
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                  <User className="h-5 w-5" />
                </div>
              </div>
               {/* Synergy response */}
               <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Bot className="h-5 w-5" />
                </div>
                <div className="flex-1 rounded-lg bg-background/50 px-4 py-3">
                  <p className="text-sm text-foreground/90">
                    Of course. The "moderate" interaction warning between Atorvastatin and Grapefruit means that consuming grapefruit can increase the amount of Atorvastatin in your body. This doesn't mean you must stop the medication, but it raises the risk of side effects like muscle pain. It's recommended to avoid grapefruit or discuss it with your doctor.
                  </p>
                </div>
              </div>

            </div>
            <div className="mt-4 flex flex-col gap-2 border-t border-border p-4 sm:flex-row">
              <button className="flex-1 rounded-full bg-background/70 px-4 py-2 text-left text-sm text-foreground/60 transition-colors hover:bg-border">
                What is a 'moderate' interaction?
              </button>
              <button className="flex-1 rounded-full bg-background/70 px-4 py-2 text-left text-sm text-foreground/60 transition-colors hover:bg-border">
                Tell me more about Drug-Food Interactions.
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-card/50 py-24 sm:py-32">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="text-center">
            <h2 className="font-headline text-3xl font-bold sm:text-4xl">
              Synergy's Capabilities
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-foreground/70">
              To ensure your safety, it's important to understand what Synergy
              can and cannot do.
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-10 md:grid-cols-2">
            <div>
              <h3 className="flex items-center gap-2 font-headline text-xl font-semibold text-primary">
                <CheckCircle2 />
                What Synergy Can Do
              </h3>
              <ul className="mt-4 space-y-3">
                {canDo.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-primary/80" />
                    <span className="text-foreground/80">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="flex items-center gap-2 font-headline text-xl font-semibold text-accent">
                <XCircle />
                What Synergy Cannot Do
              </h3>
              <ul className="mt-4 space-y-3">
                {cantDo.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <XCircle className="mt-1 h-5 w-5 flex-shrink-0 text-accent/80" />
                    <span className="text-foreground/80">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
