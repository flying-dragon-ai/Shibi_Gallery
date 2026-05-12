import type { Artwork, ArtworkImage } from '@shibi/shared';
import { query } from '../../db/pool.js';
import type { ArtworkRow } from '../../db/mappers.js';
import { toArtwork } from '../../db/mappers.js';

function groupArtworkRows(rows: ArtworkRow[]): Artwork[] {
  const map = new Map<string, { row: ArtworkRow; images: ArtworkImage[] }>();
  for (const row of rows) {
    const entry = map.get(row.id) ?? { row, images: [] };
    if (row.image_id && row.image_url) {
      entry.images.push({ id: row.image_id, url: row.image_url, sortOrder: row.sort_order ?? 0 });
    }
    map.set(row.id, entry);
  }
  return [...map.values()].map(({ row, images }) => toArtwork(row, images));
}

export async function listArtworks(): Promise<Artwork[]> {
  const rows = await query<ArtworkRow>(
    `SELECT a.*, ar.name AS artist_name, ai.id AS image_id, ai.url AS image_url, ai.sort_order
     FROM artworks a
     JOIN artists ar ON ar.id = a.artist_id
     LEFT JOIN artwork_images ai ON ai.artwork_id = a.id
     WHERE a.sale_status <> 'hidden'
     ORDER BY a.created_at DESC, ai.sort_order ASC`
  );
  return groupArtworkRows(rows);
}

export async function getArtwork(id: string): Promise<Artwork> {
  const rows = await query<ArtworkRow>(
    `SELECT a.*, ar.name AS artist_name, ai.id AS image_id, ai.url AS image_url, ai.sort_order
     FROM artworks a
     JOIN artists ar ON ar.id = a.artist_id
     LEFT JOIN artwork_images ai ON ai.artwork_id = a.id
     WHERE a.id = $1
     ORDER BY ai.sort_order ASC`,
    [id]
  );
  const artwork = groupArtworkRows(rows)[0];
  if (!artwork) throw Object.assign(new Error('作品不存在'), { status: 404, expose: true });
  return artwork;
}
