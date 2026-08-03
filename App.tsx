import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { HeadlineCard } from './components/HeadlineCard';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Headline } from './types';
import { fetchHeadlines } from './services/geminiService';

interface GroupedHeadlines {
  [category: string]: Headline[];
}

const CATEGORY_ICONS: Record<string, string> = {
  'AI Models': '🧠',
  'AI & Machine Learning': '🤖',
  'Android & Mobile': '📱',
  'Mobile': '📱',
  'Web Platform': '🌐',
  'Cloud': '☁️',
  'Sustainable Tech': '🌿',
  'Developer Tools': '🛠️',
  'Search': '🔍',
  'General': '📌',
};

function getCategoryIcon(category: string): string {
  return CATEGORY_ICONS[category] || '✦';
}

const LoadingSkeleton: React.FC = () => (
  <div className="space-y-12 animate-fade-in">
    {[1, 2].map(group => (
      <div key={group}>
        <div className="h-8 w-48 rounded-lg shimmer mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(card => (
            <div key={card} className="glass-card rounded-2xl overflow-hidden">
              <div className="h-48 shimmer" />
              <div className="p-5 space-y-3">
                <div className="h-3 w-20 rounded shimmer" />
                <div className="h-5 w-3/4 rounded shimmer" />
                <div className="space-y-2">
                  <div className="h-3 w-full rounded shimmer" />
                  <div className="h-3 w-2/3 rounded shimmer" />
                </div>
                <div className="h-10 rounded-xl shimmer mt-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

const App: React.FC = () => {
  const [headlines, setHeadlines] = useState<Headline[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);

  const loadHeadlines = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedHeadlines = await fetchHeadlines();
      setHeadlines(prevHeadlines => {
        const existingIds = new Set(prevHeadlines.map(h => h.id));
        const newUniqueHeadlines = fetchedHeadlines.filter(h => !existingIds.has(h.id));
        return [...prevHeadlines, ...newUniqueHeadlines];
      });
    } catch (err) {
      console.warn("API failed, using dummy fallback data for display.", err);
      const dummyData: Headline[] = [
        {
          id: '1',
          title: 'Project Astra: Real-time Multimodal AI',
          category: 'AI Models',
          summary: 'A new breakthrough in real-time AI agents capable of reasoning across video, audio, and text with minimal latency.',
          imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop',
          actionText: 'Watch Demo',
          actionLink: '#',
          status: 'Preview',
          statusColor: 'bg-yellow-100 text-yellow-800',
          announcementTimestamp: '2025-05-19T16:00:00Z',
        },
        {
          id: '2',
          title: 'Gemma 4 Released',
          category: 'AI Models',
          summary: 'The next generation of open models, featuring state-of-the-art performance for edge devices and cloud inference.',
          imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&h=400&fit=crop',
          actionText: 'Download Weights',
          actionLink: '#',
          status: 'Available',
          statusColor: 'bg-green-100 text-green-800',
          announcementTimestamp: '2025-05-19T16:20:00Z',
        },
        {
          id: '3',
          title: 'Android 16: Intelligent OS',
          category: 'Mobile',
          summary: 'Android 16 integrates Gemini directly into the core OS, allowing for unparalleled on-device reasoning and privacy-first features.',
          imageUrl: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=600&h=400&fit=crop',
          actionText: 'Developer Preview',
          actionLink: '#',
          status: 'Beta',
          statusColor: 'bg-blue-100 text-blue-800',
          announcementTimestamp: '2025-05-19T17:00:00Z',
        },
      ];
      setHeadlines(dummyData);
    } finally {
      setIsLoading(false);
      if (isInitialLoad) setIsInitialLoad(false);
    }
  }, [isInitialLoad]);

  useEffect(() => {
    if (isInitialLoad) {
        loadHeadlines();
    }
  }, [loadHeadlines, isInitialLoad]);

  const sortedAndGroupedHeadlines = useMemo(() => {
    const sortedHeadlines = [...headlines].sort((a, b) => {
      const dateA = a.announcementTimestamp ? new Date(a.announcementTimestamp) : null;
      const dateB = b.announcementTimestamp ? new Date(b.announcementTimestamp) : null;
      if (dateA && dateB) return dateA.getTime() - dateB.getTime();
      if (dateA) return -1;
      if (dateB) return 1;
      return 0;
    });

    return sortedHeadlines.reduce((acc, headline) => {
      const category = headline.category || 'Uncategorized';
      if (!acc[category]) acc[category] = [];
      acc[category].push(headline);
      return acc;
    }, {} as GroupedHeadlines);
  }, [headlines]);

  const sortedCategories = useMemo(() => {
    return Object.keys(sortedAndGroupedHeadlines).sort((a, b) => a.localeCompare(b));
  }, [sortedAndGroupedHeadlines]);

  // Track cumulative card index for stagger animation across categories
  let globalCardIndex = 0;

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-10 sm:px-6 lg:px-8 max-w-7xl">
        {/* Hero section */}
        <div className="mb-12 text-center animate-fade-in">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
            <span className="text-white">Google I/O </span>
            <span className="gradient-text">2025</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-white/40 max-w-2xl mx-auto leading-relaxed">
            AI-generated highlights and announcements from the biggest developer event of the year.
          </p>
        </div>

        {/* Refresh button */}
        <div className="text-center mb-10 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <button
            onClick={loadHeadlines}
            disabled={isLoading}
            className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent-teal/50 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: isLoading ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg, #00BCD4, #4285F4)',
            }}
            aria-busy={isLoading}
            aria-live="polite"
          >
            <svg
              className={`w-4 h-4 transition-transform ${isLoading ? 'animate-spin' : 'group-hover:rotate-180'}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="text-white">
              {isLoading
                ? (isInitialLoad ? 'Loading…' : 'Fetching…')
                : 'Refresh Announcements'
              }
            </span>
          </button>
        </div>

        {/* Loading skeleton */}
        {isLoading && isInitialLoad && <LoadingSkeleton />}

        {/* Error state */}
        {error && (
          <div className="text-center py-8 px-6 glass-card rounded-2xl border-accent-coral/20 max-w-lg mx-auto animate-fade-in" role="alert">
            <div className="text-3xl mb-3">⚠️</div>
            <p className="text-sm text-white/60">{error}</p>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !error && headlines.length === 0 && (
          <div className="text-center py-16 animate-fade-in">
            <div className="text-5xl mb-4">📡</div>
            <p className="text-lg text-white/40">No announcements yet.</p>
            <p className="text-sm text-white/20 mt-1">Hit refresh to fetch the latest.</p>
          </div>
        )}

        {/* Headlines grid */}
        {!isInitialLoad && headlines.length > 0 && (
          <div className="space-y-14">
            {sortedCategories.map(category => {
              const cards = sortedAndGroupedHeadlines[category];
              return (
                <section
                  key={category}
                  aria-labelledby={`category-${category.replace(/\s+/g, '-').toLowerCase()}`}
                  className="animate-fade-in"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-xl" role="img" aria-hidden="true">
                      {getCategoryIcon(category)}
                    </span>
                    <h2
                      id={`category-${category.replace(/\s+/g, '-').toLowerCase()}`}
                      className="text-xl sm:text-2xl font-bold text-white"
                    >
                      {category}
                    </h2>
                    <span className="text-xs text-white/20 font-medium">
                      {cards.length} {cards.length === 1 ? 'update' : 'updates'}
                    </span>
                  </div>
                  <div className="category-divider mb-6" />

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cards.map((headline) => {
                      const cardIndex = globalCardIndex++;
                      return (
                        <HeadlineCard
                          key={headline.id}
                          headline={headline}
                          index={cardIndex}
                        />
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        )}

        {/* Inline loading for subsequent fetches */}
        {isLoading && !isInitialLoad && (
          <div className="text-center py-10 mt-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 text-sm text-white/30">
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Fetching more announcements…
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default App;