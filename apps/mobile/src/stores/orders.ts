import { defineStore } from 'pinia';
import type { Order } from '@shibi/shared';
import { createOrder, getOrder, listMyOrders } from '../api/orders';

export const useOrderStore = defineStore('orders', {
  state: () => ({
    orders: [] as Order[],
    current: null as Order | null
  }),
  actions: {
    async create(input: Parameters<typeof createOrder>[0]) {
      this.current = await createOrder(input);
      return this.current;
    },
    async fetchMine() {
      this.orders = await listMyOrders();
    },
    async fetchDetail(id: string) {
      this.current = await getOrder(id);
      return this.current;
    }
  }
});
