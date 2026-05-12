import { z } from 'zod';

export const userRoles = ['collector', 'artist', 'curator', 'admin'] as const;
export const artistStatuses = ['draft', 'pending', 'approved', 'rejected'] as const;
export const artworkSaleStatuses = ['available', 'reserved', 'sold', 'hidden'] as const;
export const copyrightStatuses = ['none', 'available', 'licensed'] as const;
export const curationStatuses = ['draft', 'published', 'archived'] as const;
export const orderStatuses = ['pending', 'paid', 'shipped', 'completed', 'cancelled'] as const;
export const analyticsEventTypes = ['view', 'favorite', 'purchase', 'copyright_inquiry'] as const;

export type UserRole = (typeof userRoles)[number];
export type ArtistStatus = (typeof artistStatuses)[number];
export type ArtworkSaleStatus = (typeof artworkSaleStatuses)[number];
export type CopyrightStatus = (typeof copyrightStatuses)[number];
export type CurationStatus = (typeof curationStatuses)[number];
export type OrderStatus = (typeof orderStatuses)[number];
export type AnalyticsEventType = (typeof analyticsEventTypes)[number];

export interface ApiResponse<T> {
  data: T;
  requestId?: string;
}

export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
  requestId?: string;
}

export interface UserProfile {
  id: string;
  nickname: string | null;
  avatarUrl: string | null;
  role: UserRole;
}

export interface Artist {
  id: string;
  userId: string | null;
  name: string;
  bio: string;
  education: string | null;
  exhibitions: string | null;
  status: ArtistStatus;
}

export interface ArtworkImage {
  id: string;
  url: string;
  sortOrder: number;
}

export interface Artwork {
  id: string;
  artistId: string;
  artistName?: string;
  title: string;
  description: string;
  category: string;
  size: string;
  medium: string;
  year: number;
  priceCents: number;
  saleStatus: ArtworkSaleStatus;
  copyrightStatus: CopyrightStatus;
  images: ArtworkImage[];
}

export interface Curation {
  id: string;
  title: string;
  description: string;
  coverUrl: string | null;
  status: CurationStatus;
  startsAt: string | null;
  endsAt: string | null;
  artworks?: Artwork[];
}

export interface OrderItem {
  id: string;
  artworkId: string;
  artworkTitle?: string;
  priceCents: number;
}

export interface Order {
  id: string;
  userId: string;
  totalCents: number;
  status: OrderStatus;
  receiverName: string;
  receiverPhone: string;
  address: string;
  items: OrderItem[];
  createdAt: string;
}

export const uuidParamSchema = z.object({
  id: z.string().uuid()
});

export const wechatLoginSchema = z.object({
  code: z.string().min(1),
  nickname: z.string().max(80).optional(),
  avatarUrl: z.string().url().optional()
});

export const createOrderSchema = z.object({
  artworkId: z.string().uuid(),
  receiverName: z.string().min(1).max(40),
  receiverPhone: z.string().min(6).max(30),
  address: z.string().min(5).max(300)
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(orderStatuses)
});

export const createArtistSchema = z.object({
  name: z.string().min(1).max(120),
  bio: z.string().min(1),
  education: z.string().optional(),
  exhibitions: z.string().optional(),
  status: z.enum(artistStatuses).default('pending')
});

export const updateArtistSchema = createArtistSchema.partial().refine((data) => Object.keys(data).length > 0, {
  message: '至少提供一个要更新的字段'
});

export const createArtworkSchema = z.object({
  artistId: z.string().uuid(),
  title: z.string().min(1).max(160),
  description: z.string().min(1),
  category: z.string().min(1).max(80),
  size: z.string().min(1).max(80),
  medium: z.string().min(1).max(80),
  year: z.number().int().min(1900).max(2100),
  priceCents: z.number().int().positive(),
  saleStatus: z.enum(artworkSaleStatuses).default('available'),
  copyrightStatus: z.enum(copyrightStatuses).default('available'),
  imageUrls: z.array(z.string().url()).default([])
});

export const updateArtworkSchema = createArtworkSchema.partial().refine((data) => Object.keys(data).length > 0, {
  message: '至少提供一个要更新的字段'
});

export const createCurationSchema = z.object({
  title: z.string().min(1).max(160),
  description: z.string().min(1),
  coverUrl: z.string().url().optional(),
  status: z.enum(curationStatuses).default('draft'),
  startsAt: z.string().datetime().optional(),
  endsAt: z.string().datetime().optional(),
  artworkIds: z.array(z.string().uuid()).default([])
});

export const updateCurationSchema = createCurationSchema.partial().refine((data) => Object.keys(data).length > 0, {
  message: '至少提供一个要更新的字段'
});
