import type { Curation } from '@shibi/shared';
import { request } from './request';

export function listCurations() {
  return request<Curation[]>('/curations');
}

export function getCuration(id: string) {
  return request<Curation>(`/curations/${id}`);
}
