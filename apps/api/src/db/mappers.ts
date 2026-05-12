import type { Artwork, ArtworkImage, Curation, Order, OrderItem } from '@shibi/shared';

export interface ArtworkRow {
  id: string;
  artist_id: string;
  artist_name?: string;
  title: string;
  description: string;
  category: string;
  size: string;
  medium: string;
  year: number;
  price_cents: number;
  sale_status: Artwork['saleStatus'];
  copyright_status: Artwork['copyrightStatus'];
  image_id?: string | null;
  image_url?: string | null;
  sort_order?: number | null;
}

export function toArtwork(row: ArtworkRow, images: ArtworkImage[] = []): Artwork {
  return {
    id: row.id,
    artistId: row.artist_id,
    artistName: row.artist_name,
    title: row.title,
    description: row.description,
    category: row.category,
    size: row.size,
    medium: row.medium,
    year: row.year,
    priceCents: row.price_cents,
    saleStatus: row.sale_status,
    copyrightStatus: row.copyright_status,
    images
  };
}

export interface CurationRow {
  id: string;
  title: string;
  description: string;
  cover_url: string | null;
  status: Curation['status'];
  starts_at: Date | null;
  ends_at: Date | null;
}

export function toCuration(row: CurationRow, artworks?: Artwork[]): Curation {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    coverUrl: row.cover_url,
    status: row.status,
    startsAt: row.starts_at?.toISOString() ?? null,
    endsAt: row.ends_at?.toISOString() ?? null,
    artworks
  };
}

export interface OrderRow {
  id: string;
  user_id: string;
  total_cents: number;
  status: Order['status'];
  receiver_name: string;
  receiver_phone: string;
  address: string;
  created_at: Date;
}

export interface OrderItemRow {
  id: string;
  artwork_id: string;
  artwork_title?: string;
  price_cents: number;
}

export function toOrder(row: OrderRow, items: OrderItemRow[]): Order {
  return {
    id: row.id,
    userId: row.user_id,
    totalCents: row.total_cents,
    status: row.status,
    receiverName: row.receiver_name,
    receiverPhone: row.receiver_phone,
    address: row.address,
    createdAt: row.created_at.toISOString(),
    items: items.map((item): OrderItem => ({
      id: item.id,
      artworkId: item.artwork_id,
      artworkTitle: item.artwork_title,
      priceCents: item.price_cents
    }))
  };
}
