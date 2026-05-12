import type { Artist } from '@shibi/shared';
import { query } from '../../db/pool.js';

interface ArtistRow {
  id: string;
  user_id: string | null;
  name: string;
  bio: string;
  education: string | null;
  exhibitions: string | null;
  status: Artist['status'];
}

function toArtist(row: ArtistRow): Artist {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    bio: row.bio,
    education: row.education,
    exhibitions: row.exhibitions,
    status: row.status
  };
}

export async function listArtists(): Promise<Artist[]> {
  const rows = await query<ArtistRow>('SELECT * FROM artists WHERE status = $1 ORDER BY created_at DESC', ['approved']);
  return rows.map(toArtist);
}

export async function getArtist(id: string): Promise<Artist> {
  const rows = await query<ArtistRow>('SELECT * FROM artists WHERE id = $1', [id]);
  if (!rows[0]) throw Object.assign(new Error('艺术家不存在'), { status: 404, expose: true });
  return toArtist(rows[0]);
}
