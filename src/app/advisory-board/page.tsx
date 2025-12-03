
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const advisoryBoard = [
  {
    name: 'Dr. Anya Sharma, PharmD',
    title: 'Lead Clinical Pharmacist',
    quote:
      'Our goal is to bridge the gap between data and patient outcomes. Contextual AI is the key.',
    imageId: 'advisory-headshot-1',
  },
  {
    name: 'Dr. Ben Carter, MD, PhD',
    title: 'Chief Medical Officer',
    quote:
      'Predictive analytics in pharmacology isn\'t just novel; it\'s a new standard of care we\'re pioneering.',
    imageId: 'advisory-headshot-2',
  },
  {
    name: 'Dr. Chloe Davis, PhD',
    title: 'Head of Machine Learning',
    quote:
      'We\'re teaching our models to understand the nuances of human biology, creating a safer future.',
    imageId: 'advisory-headshot-3',
  },
  {
    name: 'Dr. David Lee, MD',
    title: 'Internal Medicine &amp; Safety',
    quote:
      'In my practice, I see the real-world impact of adverse drug events. This technology will save lives.',
    imageId: 'advisory-headshot-4',
  },
];

export default function AdvisoryBoardPage() {
  return (
    <div className="container mx-auto px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
          Meet the Experts Guiding Our AI
        </h1>
        <p className="mt-6 text-lg leading-8 text-foreground/70">
          Our technology is backed by a world-class team of clinicians,
          researchers, and data scientists dedicated to medication safety and
          innovation.
        </p>
      </div>

      <div className="mt-20 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
        {advisoryBoard.map((member) => {
          const image = PlaceHolderImages.find((img) => img.id === member.imageId);
          return (
            <div
              key={member.name}
              className="group relative flex flex-col items-center text-center"
            >
              <div className="relative h-48 w-48 overflow-hidden rounded-full">
                {image && (
                  <Image
                    src={image.imageUrl}
                    alt={member.name}
                    width={192}
                    height={192}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    data-ai-hint={image.imageHint}
                  />
                )}
              </div>
              <h3 className="mt-6 font-headline text-xl font-semibold text-foreground">
                {member.name}
              </h3>
              <p className="text-md font-medium text-primary">{member.title}</p>
              <p className="mt-2 text-sm text-foreground/60 italic">
                &ldquo;{member.quote}&rdquo;
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
