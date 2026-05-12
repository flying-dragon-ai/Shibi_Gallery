import type { AnalyticsEventType } from '@shibi/shared';
import { query } from '../../db/pool.js';

export async function recordEvent(input: {
  userId?: string;
  eventType: AnalyticsEventType;
  targetType: string;
  targetId: string;
}): Promise<void> {
  await query(
    `INSERT INTO analytics_events (user_id, event_type, target_type, target_id)
     VALUES ($1, $2, $3, $4)`,
    [input.userId ?? null, input.eventType, input.targetType, input.targetId]
  );
}

export async function getDashboardStats() {
  const [artworks, orders, favorites, events] = await Promise.all([
    query<{ count: string }>('SELECT count(*) FROM artworks'),
    query<{ count: string; revenue: string | null }>(
      `SELECT count(*), COALESCE(sum(total_cents), 0)::text AS revenue FROM orders WHERE status <> 'cancelled'`
    ),
    query<{ count: string }>('SELECT count(*) FROM favorites'),
    query<{ event_type: string; count: string }>(
      `SELECT event_type, count(*) FROM analytics_events GROUP BY event_type ORDER BY event_type`
    )
  ]);

  return {
    artworkCount: Number(artworks[0]?.count ?? 0),
    orderCount: Number(orders[0]?.count ?? 0),
    revenueCents: Number(orders[0]?.revenue ?? 0),
    favoriteCount: Number(favorites[0]?.count ?? 0),
    events: events.map((row) => ({ eventType: row.event_type, count: Number(row.count) }))
  };
}
