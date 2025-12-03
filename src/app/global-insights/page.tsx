
'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Users, Pill, Leaf } from 'lucide-react';
import {
  Bar,
  BarChart as RechartsBarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

const ageData = [
  { name: '18-24', value: 120 },
  { name: '25-34', value: 300 },
  { name: '35-44', value: 450 },
  { name: '45-54', value: 600 },
  { name: '55-64', value: 750 },
  { name: '65+', value: 900 },
];

const WorldMap = () => (
  <div className="relative aspect-[2/1] w-full">
    <svg viewBox="0 0 1000 500" className="h-full w-full">
      {/* A very simplified world map SVG path */}
      <path
        d="M998 253c-1-4-3-8-4-12-10-33-31-63-54-90-2-3-4-5-6-8-25-33-54-62-87-86-3-2-6-4-9-6-11-7-23-14-35-19s-25-10-37-13c-15-3-30-5-45-5-29-1-58 2-86 8-15 3-30 8-44 14-25 10-48 24-69 41-21 17-39 37-54 59-2 3-4 6-6 9-9 17-17 35-23 54-4 12-6 24-7 37-2 16-2 33 0 49 2 13 5 26 10 38 9 24 23 46 41 65 25 25 56 45 90 56 21 7 43 12 65 15 47 6 95-3 139-22 22-10 43-22 62-37 32-24 58-55 77-89 6-10 11-21 15-32 8-20 12-42 12-64 0-11-1-21-3-31z M500 483C233 483 17 267 17 250S233 17 500 17s483 216 483 233-216 233-483 233z"
        fill="hsl(var(--card))"
        stroke="hsl(var(--primary) / 0.3)"
        strokeWidth="1.5"
      />
      {/* Animated pulses */}
      {[
        { cx: 200, cy: 180 },
        { cx: 750, cy: 220 },
        { cx: 500, cy: 350 },
        { cx: 300, cy: 400 },
        { cx: 650, cy: 120 },
      ].map((p, i) => (
        <circle
          key={i}
          cx={p.cx}
          cy={p.cy}
          r="3"
          fill={i % 2 === 0 ? 'hsl(var(--primary))' : 'hsl(var(--accent))'}
        >
          <animate
            attributeName="r"
            from="3"
            to="20"
            dur="2s"
            begin={`${i * 0.4}s`}
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            from="1"
            to="0"
            dur="2s"
            begin={`${i * 0.4}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}
    </svg>
    <div className="absolute inset-0 bg-grid-gray-700/10 [mask-image:radial-gradient(ellipse_at_center,white_30%,transparent_70%)]"></div>
  </div>
);

export default function GlobalInsightsPage() {
  return (
    <div className="py-24 sm:py-32">
      <div className="container mx-auto px-4 text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
          Global Medication Insights
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-foreground/70">
          A live, anonymized look at medication and interaction trends from
          around the world, powered by Nexus-Med data.
        </p>
        <p className="mt-2 text-sm text-accent">
          Disclaimer: All data is aggregated and fully anonymized. No personal
          health information is ever displayed.
        </p>
      </div>
      <div className="container mx-auto mt-16 max-w-7xl px-4">
        <Card className="relative overflow-hidden border-border bg-card/80 shadow-2xl backdrop-blur-sm">
          <CardContent className="p-2 md:p-4">
            <WorldMap />
          </CardContent>
        </Card>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Top Interaction Check
              </CardTitle>
              <Pill className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Lisinopril + Ibuprofen</div>
              <p className="text-xs text-muted-foreground">
                Most frequent pair analyzed this week
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Trending Food Query
              </CardTitle>
              <Leaf className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Grapefruit</div>
              <p className="text-xs text-muted-foreground">
                +21% in queries vs. last month
              </p>
            </CardContent>
          </Card>
          <Card className="col-span-1 md:col-span-2">
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Checks by Age Group
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[100px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={ageData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="name"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                  />
                   <Tooltip
                    contentStyle={{
                      background: 'hsl(var(--background))',
                      borderColor: 'hsl(var(--border))',
                      color: 'hsl(var(--foreground))',
                      borderRadius: 'var(--radius)'
                    }}
                    cursor={{fill: 'hsl(var(--card))'}}
                  />
                  <Bar
                    dataKey="value"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                </RechartsBarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
