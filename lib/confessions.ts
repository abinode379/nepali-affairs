export type Confession = {
  id: number;
  category: string;
  preview: string;
  date: string;
};

export const approvedConfessions: Confession[] = [
  {
    id: 1,
    category: 'Culture',
    preview: 'I witnessed a quiet festival offering deep respect for family traditions, even when no one was looking.',
    date: 'June 1, 2026'
  },
  {
    id: 2,
    category: 'Memory',
    preview: 'A single song on a summer night made me miss the mountains I grew up near more than anything else.',
    date: 'May 29, 2026'
  },
  {
    id: 3,
    category: 'City Life',
    preview: 'In the middle of Kathmandu traffic, I found an unexpected moment of kindness from a stranger.',
    date: 'May 24, 2026'
  }
];
