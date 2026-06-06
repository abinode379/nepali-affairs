export interface SiteConfig {
  name: string;
  description: string;
  heroCta: string;
}

export interface SubscribeResponse {
  success: boolean;
  message: string;
}

export interface Confession {
  id: string;
  title: string | null;
  story: string;
  category: string;
  status: string;
  featured: boolean;
  created_at: string;
}
