import { defineStore } from 'pinia';
import type { Artwork } from '@shibi/shared';
import { addFavorite, listFavorites, removeFavorite } from '../api/favorites';

export const useFavoriteStore = defineStore('favorites', {
  state: () => ({
    items: [] as Artwork[]
  }),
  actions: {
    async fetchFavorites() {
      this.items = await listFavorites();
    },
    async add(artworkId: string) {
      await addFavorite(artworkId);
      await this.fetchFavorites();
    },
    async remove(artworkId: string) {
      await removeFavorite(artworkId);
      this.items = this.items.filter((item) => item.id !== artworkId);
    }
  }
});
