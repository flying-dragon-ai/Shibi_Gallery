import type { Artwork, ArtworkSaleStatus, CopyrightStatus } from '@shibi/shared';
import { request } from './request';

export type AdminArtworkPayload = {
  artistId: string;
  title: string;
  description: string;
  category: string;
  size: string;
  medium: string;
  year: number;
  priceCents: number;
  saleStatus: ArtworkSaleStatus;
  copyrightStatus: CopyrightStatus;
  imageUrls: string[];
};

export function createAdminArtwork(payload: AdminArtworkPayload) {
  return request<Artwork>('/admin/artworks', { method: 'POST', body: payload });
}

export function updateAdminArtwork(id: string, payload: Partial<AdminArtworkPayload>) {
  return request<Artwork>(`/admin/artworks/${id}`, { method: 'POST', body: payload });
}

export function updateAdminOrderStatus(id: string, status: string) {
  return request(`/admin/orders/${id}/status`, { method: 'POST', body: { status } });
}
