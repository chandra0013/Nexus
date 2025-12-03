'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

type ReportDisplayProps = {
  report: string;
  onReset: () => void;
};

// A simple markdown-like parser for the report
function parseReport(reportText: string) {
  return reportText.split('\n').map((line, index) => {
    if (line.startsWith('### ')) {
      return (
        <h3 key={index} className="mt-4 mb-2 font-headline text-xl font-bold text-primary">
          {line.substring(4)}
        </h3>
      );
    }
    if (line.startsWith('## ')) {
      return (
        <h2 key={index} className="mt-6 mb-3 border-b border-border pb-2 font-headline text-2xl font-bold">
          {line.substring(3)}
        </h2>
      );
    }
    if (line.startsWith('* **') || line.startsWith('- **')) {
      const boldEnd = line.indexOf('**', 4);
      const boldText = line.substring(4, boldEnd);
      const restText = line.substring(boldEnd + 2);
      return (
        <p key={index} className="my-1">
          <strong className="text-accent">{boldText}</strong>
          {restText}
        </p>
      );
    }
    if (line.trim() === '---') {
        return <Separator key={index} className="my-4" />
    }
    if (line.trim() === '') {
      return null;
    }
    return (
      <p key={index} className="my-1 leading-relaxed text-foreground/80">
        {line}
      </p>
    );
  });
}

export function ReportDisplay({ report, onReset }: ReportDisplayProps) {
  const parsedContent = parseReport(report);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-border bg-card shadow-xl">
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="font-headline text-3xl text-primary">
            Your ContextualRx Report
          </CardTitle>
          <Button variant="outline" onClick={onReset} className="rounded-full">
            <RefreshCw className="mr-2 h-4 w-4" />
            New Analysis
          </Button>
        </CardHeader>
        <CardContent>
          <div className="prose prose-invert max-w-none text-foreground/90">
            {parsedContent}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
