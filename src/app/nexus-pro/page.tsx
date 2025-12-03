'use client';

const videoCategories = [
  {
    category: 'Nutrition and Diet Tips',
    videos: [
      {
        title: 'Foods to Boost Your Immune System Naturally',
        embedCode:
          '<iframe width="560" height="315" src="https://www.youtube.com/embed/dxtZUg0tFQQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>',
      },
      {
        title: 'Top 9 Superfoods Every Indian Must Eat',
        embedCode:
          '<iframe width="560" height="315" src="https://www.youtube.com/embed/dsOVCR6EyCg" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>',
      },
      {
        title: 'Best Protein Sources (Veg & Non-Veg)',
        embedCode:
          '<iframe width="560" height="315" src="https://www.youtube.com/embed/i8dJ6perhOE" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>',
      },
      {
        title: 'How Much to Eat For a Healthy Life (Sadhguru)',
        embedCode:
          '<iframe width="560" height="315" src="https://www.youtube.com/embed/1YJtObLos5g" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>',
      },
      {
        title: 'Natural Food Tips for High Blood Pressure (Sadhguru)',
        embedCode:
          '<iframe width="560" height="315" src="https://www.youtube.com/embed/Gd6a30TfKg8" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>',
      },
      {
        title: 'Realistic Nutrition Tips',
        embedCode:
          '<iframe width="560" height="315" src="https://www.youtube.com/embed/zfP9yZAgeLY" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>',
      },
    ],
  },
  {
    category: 'General Health and Wellness',
    videos: [
      {
        title: '12 Tips to Improve Your Gut Health',
        embedCode:
          '<iframe width="560" height="315" src="https://www.youtube.com/embed/-ls8zsdWGdk" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>',
      },
      {
        title: 'Avoid These Foods to Protect Your Kidneys',
        embedCode:
          '<iframe width="560" height="315" src="https://www.youtube.com/embed/PxpRioIeubM" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>',
      },
      {
        title: 'Food is Medicine | Natural Foods for Every Organ',
        embedCode:
          '<iframe width="560" height="315" src="https://www.youtube.com/embed/eNd_7XEmN94" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>',
      },
      {
        title: 'How to Make Healthy Living Really Simple (TEDx Talk)',
        embedCode:
          '<iframe width="560" height="315" src="https://www.youtube.com/embed/XbqozR7pe3o" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>',
      },
      {
        title: '9 Healthy Habits to Transform Your Life',
        embedCode:
          '<iframe width="560" height="315" src="https://www.youtube.com/embed/RZj-gkGGRh8" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>',
      },
      {
        title: 'Daily Health Tips (Short)',
        embedCode:
          '<iframe width="560" height="315" src="https://www.youtube.com/embed/JbAig5Zou40" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>',
      },
      {
        title: 'Ayurvedic Health Tips (Short)',
        embedCode:
          '<iframe width="560" height="315" src="https://www.youtube.com/embed/1TiKerU5YLs" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>',
      },
    ],
  },
  {
    category: 'Fitness and Exercise',
    videos: [
      {
        title: 'How These Indian Workers Are So Ripped',
        embedCode:
          '<iframe width="560" height="315" src="https://www.youtube.com/embed/OnO6wiGCyRU" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>',
      },
      {
        title: 'Beginner Workout (Short)',
        embedCode:
          '<iframe width="560" height="315" src="https://www.youtube.com/embed/EWhMxVsIfPY" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>',
      },
      {
        title: 'Village Desi Exercise Motivation (Short)',
        embedCode:
          '<iframe width="560" height="315" src="https://www.youtube.com/embed/5vWGYSRfeQQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>',
      },
    ],
  },
  {
    category: 'Healthcare System',
    videos: [
      {
        title: "How to Fix India's Broken Healthcare System (Think School)",
        embedCode:
          '<iframe width="560" height="315" src="https://www.youtube.com/embed/Lhc_NfG54PA" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>',
      },
    ],
  },
];

export default function NexusProPage() {
  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-background via-card to-background"></div>
      <div className="container mx-auto px-4 py-16 sm:py-24">
        <div className="text-center">
          <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Nexus Pro: Curated Health &amp; Wellness Videos
          </h1>
          <p className="mt-4 text-lg text-foreground/70">
            Learn from experts in nutrition, fitness, and wellness.
          </p>
        </div>

        <div className="mt-12 space-y-16">
          {videoCategories.map((category) => (
            <section key={category.category}>
              <h2 className="mb-8 font-headline text-3xl font-bold text-primary">
                {category.category}
              </h2>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {category.videos.map((video) => (
                  <div
                    key={video.title}
                    className="overflow-hidden rounded-lg border border-border bg-card shadow-lg transition-all hover:border-primary/50 hover:shadow-primary/10"
                  >
                    <div
                      className="aspect-video"
                      dangerouslySetInnerHTML={{ __html: video.embedCode }}
                    ></div>
                    <div className="p-4">
                      <h3 className="font-semibold text-foreground">
                        {video.title}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
