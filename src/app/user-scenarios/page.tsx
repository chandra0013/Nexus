
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const scenarios = [
  {
    title: 'The Caregiver',
    subtitle: "Managing Mom's Many Medications",
    story: "Sarah's 72-year-old mother is on five different medications for her heart, diabetes, and arthritis. A new prescription for a sleep aid was added, and Sarah used Nexus-Med to check for interactions. The AI report highlighted a moderate risk with one of her mother's blood pressure pills that a standard checker missed, due to her age and specific diagnosis. The AI chatbot then explained it in simple terms, empowering Sarah to have a confident conversation with the doctor to adjust the treatment plan.",
    imageId: 'user-scenario-caregiver',
    imageAlt: "A caring daughter helps her elderly mother with medications.",
  },
  {
    title: 'The Athlete',
    subtitle: 'Optimizing Performance Safely',
    story: "Mark, a competitive cyclist, takes a daily allergy medication and uses several supplements like creatine and a pre-workout blend. He was considering adding St. John's Wort for mood support. Using Nexus-Med, he ran his medication and supplement list. The synthesis engine flagged that St. John's Wort could potentially reduce the effectiveness of his allergy medication. He decided against it, preventing a potential dip in performance during allergy season.",
    imageId: 'user-scenario-athlete',
    imageAlt: "An athlete organizing their supplements and medications.",
  },
  {
    title: 'The Traveler',
    subtitle: 'Navigating New Foods with Confidence',
    story: "On a trip to Southeast Asia, Maria, who takes a daily anticoagulant, wanted to try the local citrus fruits, including pomelo. Remembering a warning about grapefruit, she used Nexus-Med's food query feature. The report confirmed that pomelo has similar compounds to grapefruit and could increase her medication's effect, raising bleeding risk. She enjoyed other local fruits instead, traveling with peace of mind.",
    imageId: 'user-scenario-traveler',
    imageAlt: "A traveler looking at exotic fruits in a market.",
  },
];

export default function UserScenariosPage() {
  return (
    <div className="py-24 sm:py-32">
      <div className="container mx-auto px-4 text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
          Real Scenarios, Real Impact
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-foreground/70">
          Nexus-Med is designed for everyone. See how different people use our
          platform to make safer, more informed decisions about their health.
        </p>
      </div>

      <div className="container mx-auto mt-20 max-w-6xl px-4">
        <div className="space-y-24">
          {scenarios.map((scenario, index) => {
            const image = PlaceHolderImages.find(p => p.id === scenario.imageId);
            const isReversed = index % 2 !== 0;

            return (
              <div key={scenario.title} className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
                <div className={`relative h-80 w-full overflow-hidden rounded-lg shadow-xl ${isReversed ? 'lg:order-last' : ''}`}>
                  {image && (
                    <Image
                      src={image.imageUrl}
                      alt={scenario.imageAlt}
                      fill
                      className="object-cover"
                      data-ai-hint={image.imageHint}
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                <div>
                  <h2 className="font-headline text-3xl font-bold text-primary">
                    {scenario.title}
                  </h2>
                  <p className="mt-1 text-lg font-semibold text-foreground/80">{scenario.subtitle}</p>
                  <p className="mt-4 text-base leading-relaxed text-foreground/70">
                    {scenario.story}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
