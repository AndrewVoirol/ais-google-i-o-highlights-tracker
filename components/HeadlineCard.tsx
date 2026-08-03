
import React from 'react';
import { Headline } from '../types';

interface HeadlineCardProps {
  headline: Headline;
}

export const HeadlineCard: React.FC<HeadlineCardProps> = ({ headline }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col transition-all duration-300 hover:shadow-2xl">
      <img 
        className="w-full h-56 object-cover" 
        src={headline.imageUrl} 
        alt={headline.title} 
      />
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-center mb-2">
          <p className="text-xs font-medium text-blue-600 uppercase tracking-wider">{headline.category}</p>
          {headline.status && headline.statusColor && (
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${headline.statusColor}`}>
              {headline.status}
            </span>
          )}
        </div>
        <h3 className="text-2xl font-semibold text-slate-800 mb-3 leading-tight">{headline.title}</h3>
        <p className="text-sm text-slate-600 mb-5 flex-grow">{headline.summary}</p>
        
        <div className="mt-auto space-y-3">
          <a
            href={headline.actionLink}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center bg-blue-600 text-white px-5 py-3 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            {headline.actionText}
          </a>
          {headline.learnMoreLink && headline.learnMoreText && (
            <a
              href={headline.learnMoreLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center bg-slate-100 text-slate-700 px-5 py-3 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-opacity-50"
            >
              {headline.learnMoreText}
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
