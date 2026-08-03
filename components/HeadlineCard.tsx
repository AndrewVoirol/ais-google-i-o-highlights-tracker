
import React from 'react';
import { Headline } from '../types';

interface HeadlineCardProps {
  headline: Headline;
  index: number;
}

function getStatusClass(status?: string): string {
  switch (status?.toLowerCase()) {
    case 'available': return 'status-available';
    case 'beta': return 'status-beta';
    case 'preview': return 'status-preview';
    case 'waitlist': return 'status-waitlist';
    default: return 'status-available';
  }
}

function formatTimestamp(ts?: string): string | null {
  if (!ts) return null;
  try {
    const d = new Date(ts);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short',
    });
  } catch {
    return null;
  }
}

export const HeadlineCard: React.FC<HeadlineCardProps> = ({ headline, index }) => {
  const formattedTime = formatTimestamp(headline.announcementTimestamp);

  return (
    <div
      className="glass-card rounded-2xl overflow-hidden flex flex-col animate-slide-up"
      style={{ animationDelay: `${index * 80}ms`, animationFillMode: 'backwards' }}
    >
      <div className="relative overflow-hidden">
        <img
          className="w-full h-48 object-cover transition-transform duration-500 hover:scale-105"
          src={headline.imageUrl}
          alt={headline.title}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface/80 via-transparent to-transparent" />
        {headline.status && (
          <span className={`status-badge absolute top-3 right-3 ${getStatusClass(headline.status)}`}>
            {headline.status}
          </span>
        )}
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[0.65rem] font-semibold text-accent-teal uppercase tracking-[0.12em]">
            {headline.category}
          </span>
          {formattedTime && (
            <>
              <span className="text-white/15">·</span>
              <span className="text-[0.65rem] text-white/30">{formattedTime}</span>
            </>
          )}
        </div>

        <h3 className="text-lg font-bold text-white mb-2 leading-snug">
          {headline.title}
        </h3>

        <p className="text-sm text-white/50 mb-5 flex-grow leading-relaxed">
          {headline.summary}
        </p>

        <div className="mt-auto space-y-2">
          <a
            href={headline.actionLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary block w-full text-center px-4 py-2.5 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-accent-teal/50"
          >
            <span>{headline.actionText}</span>
          </a>
          {headline.learnMoreLink && headline.learnMoreText && (
            <a
              href={headline.learnMoreLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center px-4 py-2.5 rounded-xl text-sm font-medium text-white/50 bg-white/5 hover:bg-white/10 hover:text-white/70 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/20"
            >
              {headline.learnMoreText}
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
