import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { HeadlineCard } from './components/HeadlineCard';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Headline } from './types';
import { fetchHeadlines } from './services/geminiService';

interface GroupedHeadlines {
  [category: string]: Headline[];
}

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
          imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80',
          actionText: 'Watch Demo',
          actionLink: '#',
          status: 'Preview',
          statusColor: 'bg-purple-100 text-purple-800'
        },
        {
          id: '2',
          title: 'Gemma 4 Released',
          category: 'AI Models',
          summary: 'The next generation of open models, featuring state-of-the-art performance for edge devices and cloud inference.',
          imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80',
          actionText: 'Download Weights',
          actionLink: '#',
          status: 'Available',
          statusColor: 'bg-green-100 text-green-800'
        },
        {
          id: '3',
          title: 'Android 16: Intelligent OS',
          category: 'Mobile',
          summary: 'Android 16 integrates Gemini directly into the core OS, allowing for unparalleled on-device reasoning and privacy.',
          imageUrl: 'https://images.unsplash.com/photo-1607252656733-fd7407042e9e?auto=format&fit=crop&q=80',
          actionText: 'Developer Preview',
          actionLink: '#',
          status: 'Beta',
          statusColor: 'bg-blue-100 text-blue-800'
        }
      ];
      setHeadlines(dummyData);
      if (err instanceof Error && err.message.includes('API key')) {
         setError('API key not configured. Showing sample data.');
      }
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
    // 1. Sort all headlines by announcementTimestamp
    const sortedHeadlines = [...headlines].sort((a, b) => {
      const dateA = a.announcementTimestamp ? new Date(a.announcementTimestamp) : null;
      const dateB = b.announcementTimestamp ? new Date(b.announcementTimestamp) : null;

      if (dateA && dateB) {
        return dateA.getTime() - dateB.getTime(); // Corrected date comparison
      }
      if (dateA) return -1; // A has date, B doesn't, A comes first
      if (dateB) return 1;  // B has date, A doesn't, B comes first
      return 0; // Neither has a valid date, keep original relative order
    });

    // 2. Group the sorted headlines by category
    return sortedHeadlines.reduce((acc, headline) => {
      const category = headline.category || 'Uncategorized';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(headline);
      return acc;
    }, {} as GroupedHeadlines);
  }, [headlines]);

  const sortedCategories = useMemo(() => {
    // Categories are sorted alphabetically, headlines within them are chronological
    return Object.keys(sortedAndGroupedHeadlines).sort((a, b) => a.localeCompare(b));
  }, [sortedAndGroupedHeadlines]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-slate-800 sm:text-5xl">
            Google I/O 2025 Key Announcements
          </h1>
          <p className="mt-3 text-lg text-slate-600 max-w-2xl mx-auto">
            Catch up on the latest AI-generated innovations and updates from Google I/O 2025, inspired by official themes. Explore new products, features, and how to get started.
          </p>
        </div>

        <div className="text-center mb-10">
          <button
            onClick={loadHeadlines}
            disabled={isLoading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-busy={isLoading}
            aria-live="polite"
          >
            {isLoading ? (isInitialLoad ? 'Loading Initial Announcements...' : 'Fetching More...') : 'Refresh/Load More Announcements'}
          </button>
        </div>

        {isLoading && isInitialLoad && (
          <div className="text-center py-10">
            <p className="text-xl text-slate-600">Loading announcements...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-10 bg-red-50 border border-red-200 p-4 rounded-md">
            <p className="text-xl text-red-700" role="alert">{error}</p>
          </div>
        )}

        {!isLoading && !error && headlines.length === 0 && (
          <div className="text-center py-10">
            <p className="text-xl text-slate-600">No announcements found. Try refreshing to fetch some!</p>
          </div>
        )}

        {!isInitialLoad && headlines.length > 0 && (
          <div className="space-y-12">
            {sortedCategories.map(category => (
              <section key={category} aria-labelledby={`category-${category.replace(/\s+/g, '-').toLowerCase()}`}>
                <h2 
                  id={`category-${category.replace(/\s+/g, '-').toLowerCase()}`} 
                  className="text-2xl sm:text-3xl font-bold text-slate-800 mb-6 pb-2 border-b-2 border-blue-500"
                >
                  {category}
                </h2>
                {sortedAndGroupedHeadlines[category].length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {sortedAndGroupedHeadlines[category].map((headline) => (
                      <HeadlineCard key={headline.id} headline={headline} />
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500">No announcements currently in this category.</p>
                )}
              </section>
            ))}
          </div>
        )}
         {isLoading && !isInitialLoad && (
          <div className="text-center py-10 mt-8">
            <p className="text-lg text-slate-500">Fetching more announcements...</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default App;