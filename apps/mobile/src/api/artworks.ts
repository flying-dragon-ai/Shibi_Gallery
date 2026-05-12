import type { Artwork } from '@shibi/shared';
import { request } from './request';

export function listArtworks() {
  return request<Artwork[]>('/artworks');
}

export function getArtwork(id: string) {
  return request<Artwork>(`/artworks/${id}`);
}
