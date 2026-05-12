import type { OrderStatus } from '@shibi/shared';
import { pool, query } from '../../db/pool.js';
import type { OrderItemRow, OrderRow } from '../../db/mappers.js';
import { toOrder } from '../../db/mappers.js';
import { recordEvent } from '../analytics/analytics.service.js';

export async function createOrder(input: {
  userId: string;
  artworkId: string;
  receiverName: string;
  receiverPhone: string;
  address: string;
}) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const artworkResult = await client.query<{ id: string; price_cents: number; sale_status: string }>(
      `SELECT id, price_cents, sale_status FROM artworks WHERE id = $1 FOR UPDATE`,
      [input.artworkId]
    );
    const artwork = artworkResult.rows[0];
    if (!artwork) throw Object.assign(new Error('作品不存在'), { status: 404, expose: true });
    if (artwork.sale_status !== 'available') throw Object.assign(new Error('作品当前不可购买'), { status: 409, expose: true });

    const orderResult = await client.query<OrderRow>(
      `INSERT INTO orders (user_id, total_cents, status, receiver_name, receiver_phone, address)
       VALUES ($1, $2, 'pending', $3, $4, $5)
       RETURNING *`,
      [input.userId, artwork.price_cents, input.receiverName, input.receiverPhone, input.address]
    );

    const itemResult = await client.query<OrderItemRow>(
      `INSERT INTO order_items (order_id, artwork_id, price_cents)
       VALUES ($1, $2, $3)
       RETURNING id, artwork_id, price_cents`,
      [orderResult.rows[0].id, input.artworkId, artwork.price_cents]
    );

    await client.query(`UPDATE artworks SET sale_status = 'reserved', updated_at = now() WHERE id = $1`, [input.artworkId]);
    await client.query('COMMIT');
    await recordEvent({ userId: input.userId, eventType: 'purchase', targetType: 'artwork', targetId: input.artworkId });

    return toOrder(orderResult.rows[0], itemResult.rows);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export async function listMyOrders(userId: string) {
  const orders = await query<OrderRow>('SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
  const result = [];
  for (const order of orders) {
    const items = await query<OrderItemRow>(
      `SELECT oi.id, oi.artwork_id, a.title AS artwork_title, oi.price_cents
       FROM order_items oi JOIN artworks a ON a.id = oi.artwork_id
       WHERE oi.order_id = $1`,
      [order.id]
    );
    result.push(toOrder(order, items));
  }
  return result;
}

export async function getOrderForUser(orderId: string, userId: string) {
  const rows = await query<OrderRow>('SELECT * FROM orders WHERE id = $1 AND user_id = $2', [orderId, userId]);
  if (!rows[0]) throw Object.assign(new Error('订单不存在'), { status: 404, expose: true });
  const items = await query<OrderItemRow>(
    `SELECT oi.id, oi.artwork_id, a.title AS artwork_title, oi.price_cents
     FROM order_items oi JOIN artworks a ON a.id = oi.artwork_id
     WHERE oi.order_id = $1`,
    [orderId]
  );
  return toOrder(rows[0], items);
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const rows = await query<OrderRow>(
    `UPDATE orders SET status = $2, updated_at = now() WHERE id = $1 RETURNING *`,
    [orderId, status]
  );
  if (!rows[0]) throw Object.assign(new Error('订单不存在'), { status: 404, expose: true });

  if (status === 'paid' || status === 'completed') {
    await query(
      `UPDATE artworks SET sale_status = 'sold', updated_at = now()
       WHERE id IN (SELECT artwork_id FROM order_items WHERE order_id = $1)`,
      [orderId]
    );
  }
  if (status === 'cancelled') {
    await query(
      `UPDATE artworks SET sale_status = 'available', updated_at = now()
       WHERE id IN (SELECT artwork_id FROM order_items WHERE order_id = $1)`,
      [orderId]
    );
  }

  const items = await query<OrderItemRow>(
    `SELECT oi.id, oi.artwork_id, a.title AS artwork_title, oi.price_cents
     FROM order_items oi JOIN artworks a ON a.id = oi.artwork_id
     WHERE oi.order_id = $1`,
    [orderId]
  );
  return toOrder(rows[0], items);
}
