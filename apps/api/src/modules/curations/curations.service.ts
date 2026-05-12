import type { Curation } from '@shibi/shared';
import { query } from '../../db/pool.js';
import type { ArtworkRow, CurationRow } from '../../db/mappers.js';
import { toArtwork, toCuration } from '../../db/mappers.js';

export async function listCurations(): Promise<Curation[]> {
  const rows = await query<CurationRow>(
    `SELECT * FROM curations WHERE status = 'published' ORDER BY starts_at DESC NULLS LAST, created_at DESC`
  );
  return rows.map((row) => toCuration(row));
}

export async function getCuration(id: string): Promise<Curation> {
  const curationRows = await query<CurationRow>('SELECT * FROM curations WHERE id = $1', [id]);
  const curation = curationRows[0];
  if (!curation) throw Object.assign(new Error('策展不存在'), { status: 404, expose: true });

  const artworkRows = await query<ArtworkRow>(
    `SELECT a.*, ar.name AS artist_name, ai.id AS image_id, ai.url AS image_url, ai.sort_order
     FROM curation_artworks ca
     JOIN artworks a ON a.id = ca.artwork_id
     JOIN artists ar ON ar.id = a.artist_id
     LEFT JOIN LATERAL (
       SELECT * FROM artwork_images WHERE artwork_id = a.id ORDER BY sort_order ASC LIMIT 1
     ) ai ON true
     WHERE ca.curation_id = $1
     ORDER BY ca.sort_order ASC`,
    [id]
  );
  return toCuration(curation, artworkRows.map((row) => toArtwork(row, row.image_id && row.image_url ? [{ id: row.image_id, url: row.image_url, sortOrder: row.sort_order ?? 0 }] : [])));
}
