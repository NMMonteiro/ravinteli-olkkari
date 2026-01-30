import React from 'react';

export interface MenuItem {
  id: number;
  name: string;
  price: string;
  description: string;
  image: string;
  subcategory?: string;
  isChefChoice?: boolean;
}

export interface EventItem {
  id: number;
  title: string;
  date: string;
  time: string;
  description: string;
  image: string;
  type: string;
  isTonight?: boolean;
}

export interface StaffMember {
  id: number;
  name: string;
  role: string;
  description: string;
  image: string;
  rate: string;
  badge?: string;
}

export interface ArtPiece {
  id: number;
  title: string;
  medium: string;
  price: string;
  image: string;
}

export interface Wine {
  id: number;
  name: string;
  year?: string;
  region?: string;
  type?: string;
  subcategory?: string;
  price_glass?: string;
  price_bottle?: string;
  description?: string;
  image?: string;
  isSommelierChoice?: boolean;
}

export interface ChatMessage {
  id: number;
  sender: 'bot' | 'user';
  text: string | React.ReactNode;
  image?: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: 'member' | 'admin';
  is_approved: boolean;
  loyalty_points?: number;
  created_at: string;
}

export interface Booking {
  id: number;
  customer_name: string;
  email: string;
  date: string;
  time: string;
  guests: number;
  special_requests?: string;
  status: string;
  user_id?: string;
  receipt_url?: string;
  receipt_data?: any;
  points_awarded?: boolean;
  created_at?: string;
  phone?: string;
}