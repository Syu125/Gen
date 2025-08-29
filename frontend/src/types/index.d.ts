// Declare global types here

export interface User {
  id: string;
  email: string;
  name: string;
  google_id: string;
  created_at: string;
}

export interface Event {
  id: number;
  code: string;
  title: string;
  description: string;
  date: string;
  location: string;
  image_url?: string;
  creator_id: string;
  type?: string;
  subtitle?: string;
}
