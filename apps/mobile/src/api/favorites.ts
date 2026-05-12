import type { Artwork } from '@shibi/shared';
import { request } from './request';

export function listFavorites() {
  return request<Artwork[]>('/favorites/me');
}

export function addFavorite(artworkId: string) {
  return request<{ ok: boolean }>(`/favorites/${artworkId}`, { method: 'POST' });
}

export function removeFavorite(artworkId: string) {
  return request<{ ok: boolean }>(`/favorites/${artworkId}`, { method: 'DELETE' });
}
