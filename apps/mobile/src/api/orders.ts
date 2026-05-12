import type { Order } from '@shibi/shared';
import { request } from './request';

export function createOrder(input: {
  artworkId: string;
  receiverName: string;
  receiverPhone: string;
  address: string;
}) {
  return request<Order>('/orders', { method: 'POST', body: input });
}

export function listMyOrders() {
  return request<Order[]>('/orders/me');
}

export function getOrder(id: string) {
  return request<Order>(`/orders/${id}`);
}
