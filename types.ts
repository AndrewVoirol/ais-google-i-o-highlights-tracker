export interface Headline {
  id: string;
  title: string;
  category: string;
  summary: string;
  imageUrl: string;
  actionText: string;
  actionLink: string;
  learnMoreLink?: string;
  learnMoreText?: string;
  status?: 'Available' | 'Waitlist' | 'Preview' | 'Beta';
  statusColor?: string; // Tailwind color class for status badge
  announcementTimestamp?: string; // ISO 8601 string for sorting
}