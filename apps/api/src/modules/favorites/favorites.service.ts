import type { Artwork } from '@shibi/shared';
import { query } from '../../db/pool.js';
import type { ArtworkRow } from '../../db/mappers.js';
import { toArtwork } from '../../db/mappers.js';
import { recordEvent } from '../analytics/analytics.service.js';

export async function listFavorites(userId: string): Promise<Artwork[]> {
  const rows = await query<ArtworkRow>(
    `SELECT a.*, ar.name AS artist_name, ai.id AS image_id, ai.url AS image_url, ai.sort_order
     FROM favorites f
     JOIN artworks a ON a.id = f.artwork_id
     JOIN artists ar ON ar.id = a.artist_id
     LEFT JOIN LATERAL (
       SELECT * FROM artwork_images WHERE artwork_id = a.id ORDER BY sort_order ASC LIMIT 1
     ) ai ON true
     WHERE f.user_id = $1
     ORDER BY f.created_at DESC`,
    [userId]
  );

  return rows.map((row) =>
    toArtwork(row, row.image_id && row.image_url ? [{ id: row.image_id, url: row.image_url, sortOrder: row.sort_order ?? 0 }] : [])
  );
}

export async function addFavorite(userId: string, artworkId: string): Promise<void> {
  await query(
    `INSERT INTO favorites (user_id, artwork_id)
     VALUES ($1, $2)
     ON CONFLICT (user_id, artwork_id) DO NOTHING`,
    [userId, artworkId]
  );
  await recordEvent({ userId, eventType: 'favorite', targetType: 'artwork', targetId: artworkId });
}

export async function removeFavorite(userId: string, artworkId: string): Promise<void> {
  await query('DELETE FROM favorites WHERE user_id = $1 AND artwork_id = $2', [userId, artworkId]);
}
