'use client';
import { useState } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const endpoints = {
  check: {
    title: 'POST /check',
    description: 'Run a full contextual analysis.',
    request: `{
  "medicationList": "Lisinopril 10mg, Metformin 500mg",
  "healthContext": "Age 65, Type 2 Diabetes",
  "foodQuery": "Grapefruit"
}`,
    response: `{
  "report": "Generated report text..."
}`,
    codeSamples: {
      curl: `curl -X POST https://api.nexus-med.com/v1/check \\
-H "Authorization: Bearer YOUR_API_KEY" \\
-H "Content-Type: application/json" \\
-d '{
  "medicationList": "...",
  "healthContext": "...",
  "foodQuery": "..."
}'`,
      javascript: `const response = await fetch('https://api.nexus-med.com/v1/check', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    medicationList: "...",
    healthContext: "...",
    foodQuery: "..."
  })
});
const data = await response.json();`,
      python: `import requests

headers = {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json',
}
data = {
    "medicationList": "...",
    "healthContext": "...",
    "foodQuery": "..."
}
response = requests.post(
  'https://api.nexus-med.com/v1/check', 
  headers=headers, 
  json=data
)
print(response.json())`,
    },
  },
  chat: {
    title: 'POST /chat',
    description: 'Ask a follow-up question to the AI assistant.',
    request: `{
  "report": "The full report text...",
  "question": "Can you explain this warning in simpler terms?"
}`,
    response: `{
  "answer": "Generated answer text..."
}`,
    codeSamples: {
      curl: `curl -X POST https://api.nexus-med.com/v1/chat \\
-H "Authorization: Bearer YOUR_API_KEY" \\
-H "Content-Type: application/json" \\
-d '{
  "report": "...",
  "question": "..."
}'`,
      javascript: `const response = await fetch('https://api.nexus-med.com/v1/chat', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    report: "...",
    question: "..."
  })
});
const data = await response.json();`,
      python: `import requests

headers = {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json',
}
data = {
    "report": "...",
    "question": "..."
}
response = requests.post(
  'https://api.nexus-med.com/v1/chat', 
  headers=headers, 
  json=data
)
print(response.json())`,
    },
  },
};

type EndpointKey = keyof typeof endpoints;

function CodeBlock({ code }: { code: string }) {
  const { toast } = useToast();
  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    toast({ title: 'Copied to clipboard!' });
  };
  return (
    <pre className="relative rounded-lg bg-black p-4 font-code text-sm text-white">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 h-7 w-7 text-white/50 hover:bg-white/20 hover:text-white"
        onClick={copyToClipboard}
      >
        <Copy className="h-4 w-4" />
      </Button>
      <code>{code}</code>
    </pre>
  );
}

export default function DeveloperHubPage() {
  const [activeEndpoint, setActiveEndpoint] = useState<EndpointKey>('check');

  const endpoint = endpoints[activeEndpoint];

  return (
    <div>
      <section className="bg-grid-gray-700/10 py-24 sm:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            Integrate ContextualRx Anywhere
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-foreground/70">
            Power your telehealth app, EMR, or pharmacy system with the most
            advanced medication safety API on the market.
          </p>
        </div>
      </section>
      <section className="container mx-auto -mt-16 max-w-7xl px-4 pb-24">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Column: Navigation */}
          <aside className="lg:col-span-3">
            <div className="sticky top-24">
              <h3 className="mb-4 font-headline text-lg font-semibold">
                API Endpoints
              </h3>
              <nav className="flex flex-col gap-2">
                {(Object.keys(endpoints) as EndpointKey[]).map((key) => (
                  <button
                    key={key}
                    onClick={() => setActiveEndpoint(key)}
                    className={`rounded-md p-2 text-left font-code text-sm font-medium transition-colors ${
                      activeEndpoint === key
                        ? 'bg-primary/10 text-primary'
                        : 'text-foreground/70 hover:bg-card hover:text-foreground'
                    }`}
                  >
                    {endpoints[key].title}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Middle Column: Documentation */}
          <main className="lg:col-span-5">
            <h2 className="font-headline text-3xl font-bold">
              {endpoint.title}
            </h2>
            <p className="mt-2 text-foreground/70">{endpoint.description}</p>

            <h3 className="mt-8 font-headline text-xl font-semibold">
              Request Body
            </h3>
            <pre className="mt-2 rounded-lg bg-card p-4 font-code text-sm text-foreground/80">
              <code>{endpoint.request}</code>
            </pre>

            <h3 className="mt-8 font-headline text-xl font-semibold">
              Response Body
            </h3>
            <pre className="mt-2 rounded-lg bg-card p-4 font-code text-sm text-foreground/80">
              <code>{endpoint.response}</code>
            </pre>
          </main>

          {/* Right Column: Code Samples */}
          <aside className="lg:col-span-4">
            <div className="sticky top-24">
              <Tabs defaultValue="curl">
                <TabsList className="grid w-full grid-cols-3 bg-card">
                  <TabsTrigger value="curl">cURL</TabsTrigger>
                  <TabsTrigger value="javascript">JS</TabsTrigger>
                  <TabsTrigger value="python">Python</TabsTrigger>
                </TabsList>
                <TabsContent value="curl">
                  <CodeBlock code={endpoint.codeSamples.curl} />
                </TabsContent>
                <TabsContent value="javascript">
                  <CodeBlock code={endpoint.codeSamples.javascript} />
                </TabsContent>
                <TabsContent value="python">
                  <CodeBlock code={endpoint.codeSamples.python} />
                </TabsContent>
              </Tabs>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
