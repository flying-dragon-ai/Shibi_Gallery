import { defineStore } from 'pinia';
import type { Artwork } from '@shibi/shared';
import { getArtwork, listArtworks } from '../api/artworks';

export const useArtworkStore = defineStore('artworks', {
  state: () => ({
    artworks: [] as Artwork[],
    current: null as Artwork | null,
    loading: false
  }),
  actions: {
    async fetchList() {
      this.loading = true;
      try {
        this.artworks = await listArtworks();
      } finally {
        this.loading = false;
      }
    },
    async fetchDetail(id: string) {
      this.current = await getArtwork(id);
      return this.current;
    }
  }
});
