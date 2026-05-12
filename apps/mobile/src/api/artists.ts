import type { Artist } from '@shibi/shared';
import { request } from './request';

export function listArtists() {
  return request<Artist[]>('/artists');
}

export function getArtist(id: string) {
  return request<Artist>(`/artists/${id}`);
}
