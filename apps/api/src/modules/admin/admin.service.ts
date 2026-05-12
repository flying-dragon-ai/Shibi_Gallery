import {
  createArtistSchema,
  createArtworkSchema,
  createCurationSchema,
  updateArtistSchema,
  updateArtworkSchema,
  updateCurationSchema
} from '@shibi/shared';
import { query } from '../../db/pool.js';

function assertFound<T>(row: T | undefined, message: string): T {
  if (!row) throw Object.assign(new Error(message), { status: 404, expose: true });
  return row;
}

export async function createArtist(input: unknown) {
  const data = createArtistSchema.parse(input);
  const rows = await query(
    `INSERT INTO artists (name, bio, education, exhibitions, status)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [data.name, data.bio, data.education ?? null, data.exhibitions ?? null, data.status]
  );
  return rows[0];
}

export async function updateArtist(id: string, input: unknown) {
  const data = updateArtistSchema.parse(input);
  const rows = await query(
    `UPDATE artists
     SET name = COALESCE($2, name),
         bio = COALESCE($3, bio),
         education = COALESCE($4, education),
         exhibitions = COALESCE($5, exhibitions),
         status = COALESCE($6, status),
         updated_at = now()
     WHERE id = $1
     RETURNING *`,
    [id, data.name ?? null, data.bio ?? null, data.education ?? null, data.exhibitions ?? null, data.status ?? null]
  );
  return assertFound(rows[0], '艺术家不存在');
}

export async function createArtwork(input: unknown) {
  const data = createArtworkSchema.parse(input);
  const rows = await query<{ id: string }>(
    `INSERT INTO artworks (
       artist_id, title, description, category, size, medium, year, price_cents, sale_status, copyright_status
     ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     RETURNING *`,
    [
      data.artistId,
      data.title,
      data.description,
      data.category,
      data.size,
      data.medium,
      data.year,
      data.priceCents,
      data.saleStatus,
      data.copyrightStatus
    ]
  );

  for (const [index, url] of data.imageUrls.entries()) {
    await query('INSERT INTO artwork_images (artwork_id, url, sort_order) VALUES ($1, $2, $3)', [
      rows[0].id,
      url,
      index + 1
    ]);
  }
  return rows[0];
}

export async function updateArtwork(id: string, input: unknown) {
  const data = updateArtworkSchema.parse(input);
  const rows = await query<{ id: string }>(
    `UPDATE artworks
     SET artist_id = COALESCE($2, artist_id),
         title = COALESCE($3, title),
         description = COALESCE($4, description),
         category = COALESCE($5, category),
         size = COALESCE($6, size),
         medium = COALESCE($7, medium),
         year = COALESCE($8, year),
         price_cents = COALESCE($9, price_cents),
         sale_status = COALESCE($10, sale_status),
         copyright_status = COALESCE($11, copyright_status),
         updated_at = now()
     WHERE id = $1
     RETURNING *`,
    [
      id,
      data.artistId ?? null,
      data.title ?? null,
      data.description ?? null,
      data.category ?? null,
      data.size ?? null,
      data.medium ?? null,
      data.year ?? null,
      data.priceCents ?? null,
      data.saleStatus ?? null,
      data.copyrightStatus ?? null
    ]
  );
  const artwork = assertFound(rows[0], '作品不存在');

  if (data.imageUrls) {
    await query('DELETE FROM artwork_images WHERE artwork_id = $1', [id]);
    for (const [index, url] of data.imageUrls.entries()) {
      await query('INSERT INTO artwork_images (artwork_id, url, sort_order) VALUES ($1, $2, $3)', [id, url, index + 1]);
    }
  }

  return artwork;
}

export async function createCuration(input: unknown) {
  const data = createCurationSchema.parse(input);
  const rows = await query<{ id: string }>(
    `INSERT INTO curations (title, description, cover_url, status, starts_at, ends_at)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [data.title, data.description, data.coverUrl ?? null, data.status, data.startsAt ?? null, data.endsAt ?? null]
  );

  for (const [index, artworkId] of data.artworkIds.entries()) {
    await query('INSERT INTO curation_artworks (curation_id, artwork_id, sort_order) VALUES ($1, $2, $3)', [
      rows[0].id,
      artworkId,
      index + 1
    ]);
  }
  return rows[0];
}

export async function updateCuration(id: string, input: unknown) {
  const data = updateCurationSchema.parse(input);
  const rows = await query<{ id: string }>(
    `UPDATE curations
     SET title = COALESCE($2, title),
         description = COALESCE($3, description),
         cover_url = COALESCE($4, cover_url),
         status = COALESCE($5, status),
         starts_at = COALESCE($6, starts_at),
         ends_at = COALESCE($7, ends_at),
         updated_at = now()
     WHERE id = $1
     RETURNING *`,
    [
      id,
      data.title ?? null,
      data.description ?? null,
      data.coverUrl ?? null,
      data.status ?? null,
      data.startsAt ?? null,
      data.endsAt ?? null
    ]
  );
  const curation = assertFound(rows[0], '策展不存在');

  if (data.artworkIds) {
    await query('DELETE FROM curation_artworks WHERE curation_id = $1', [id]);
    for (const [index, artworkId] of data.artworkIds.entries()) {
      await query('INSERT INTO curation_artworks (curation_id, artwork_id, sort_order) VALUES ($1, $2, $3)', [
        id,
        artworkId,
        index + 1
      ]);
    }
  }

  return curation;
}
