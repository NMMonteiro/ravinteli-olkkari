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
  price: string;
  description?: string;
  image?: string;
}

export interface ChatMessage {
  id: number;
  sender: 'bot' | 'user';
  text: string | React.ReactNode;
  image?: string;
}