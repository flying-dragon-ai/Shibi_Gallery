INSERT INTO users (id, openid, nickname, role)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'mock-admin', '平台策展人', 'admin'),
  ('00000000-0000-0000-0000-000000000002', 'mock-collector', '初见藏家', 'collector')
ON CONFLICT (openid) DO NOTHING;

INSERT INTO artists (id, name, bio, education, exhibitions, status)
VALUES
  ('10000000-0000-0000-0000-000000000001', '林予白', '关注城市边缘空间与年轻人的精神栖居，以轻盈色块表达日常诗意。', '中国美术学院油画系', '2024 青年艺术家联展；2025 新锐绘画邀请展', 'approved'),
  ('10000000-0000-0000-0000-000000000002', '周岚', '以纸本综合材料记录自然、女性经验和时间痕迹。', '中央美术学院实验艺术学院', '她的花园；纸上风景计划', 'approved'),
  ('10000000-0000-0000-0000-000000000003', 'Georges Seurat', '法国后印象派画家，新印象主义与点彩技法的重要代表。', 'École des Beaux-Arts, Paris', 'Art Institute of Chicago open access public-domain collection', 'approved'),
  ('10000000-0000-0000-0000-000000000004', 'Gustave Caillebotte', '法国印象派画家，擅长以现代城市视角描绘巴黎生活。', 'École des Beaux-Arts, Paris', 'Art Institute of Chicago open access public-domain collection', 'approved'),
  ('10000000-0000-0000-0000-000000000005', 'Claude Monet', '法国印象派代表画家，以光影、色彩和自然主题闻名。', 'Académie Suisse, Paris', 'Art Institute of Chicago open access public-domain collection', 'approved'),
  ('10000000-0000-0000-0000-000000000006', 'Vincent van Gogh', '荷兰后印象派画家，以强烈笔触和情感表达影响现代艺术。', 'Royal Academy of Fine Arts, Brussels', 'Art Institute of Chicago open access public-domain collection', 'approved')
ON CONFLICT (id) DO NOTHING;

INSERT INTO artworks (id, artist_id, title, description, category, size, medium, year, price_cents, sale_status, copyright_status)
VALUES
  ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', '午后蓝房间', '来自“城市缓慢呼吸”系列，适合客厅与书房陈设。', '油画', '60 x 80 cm', '布面油画', 2025, 1280000, 'available', 'available'),
  ('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', '风停在花园里', '纸本综合材料原作，含平台鉴证证书。', '纸本', '40 x 50 cm', '纸本综合材料', 2024, 680000, 'available', 'available'),
  ('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000003', 'A Sunday on La Grande Jatte — 1884', '公共领域馆藏图像，来源于 Art Institute of Chicago Open Access，用于演示经典绘画展示。', '绘画', '207.5 x 308.1 cm', 'Oil on canvas', 1884, 9800000, 'available', 'available'),
  ('20000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000004', 'Paris Street; Rainy Day', '公共领域馆藏图像，来源于 Art Institute of Chicago Open Access，用于演示城市题材作品。', '绘画', '212.2 x 276.2 cm', 'Oil on canvas', 1877, 8600000, 'available', 'available'),
  ('20000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000005', 'Water Lilies', '公共领域馆藏图像，来源于 Art Institute of Chicago Open Access，用于演示印象派自然主题。', '绘画', '89.9 x 94.1 cm', 'Oil on canvas', 1906, 7200000, 'available', 'available'),
  ('20000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000006', 'The Bedroom', '公共领域馆藏图像，来源于 Art Institute of Chicago Open Access，用于演示后印象派室内题材。', '绘画', '72.4 x 91.3 cm', 'Oil on canvas', 1889, 9200000, 'available', 'available')
ON CONFLICT (id) DO NOTHING;

INSERT INTO artwork_images (artwork_id, url, sort_order)
VALUES
  ('20000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1541961017774-22349e4a1262', 1),
  ('20000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1515405295579-ba7b45403062', 1),
  ('20000000-0000-0000-0000-000000000003', 'https://www.artic.edu/iiif/2/2d484387-2509-5e8e-2c43-22f9981972eb/full/843,/0/default.jpg', 1),
  ('20000000-0000-0000-0000-000000000004', 'https://www.artic.edu/iiif/2/f8fd76e9-c396-5678-36ed-6a348c904d27/full/843,/0/default.jpg', 1),
  ('20000000-0000-0000-0000-000000000005', 'https://www.artic.edu/iiif/2/3c27b499-af56-f0d5-93b5-a7f2f1ad5813/full/843,/0/default.jpg', 1),
  ('20000000-0000-0000-0000-000000000006', 'https://www.artic.edu/iiif/2/6644829f-f292-c5c4-a73c-0356a6fdbf0d/full/843,/0/default.jpg', 1)
ON CONFLICT DO NOTHING;

INSERT INTO curations (id, title, description, cover_url, status, starts_at, ends_at)
VALUES
  ('30000000-0000-0000-0000-000000000001', '青年艺术家的第一面墙', '精选适合初次收藏的青年艺术家原作，强调可负担、可鉴证、可讲述。', 'https://images.unsplash.com/photo-1531058020387-3be344556be6', 'published', now(), now() + interval '30 days'),
  ('30000000-0000-0000-0000-000000000002', '公共领域经典绘画', '精选 Art Institute of Chicago 开放获取公共领域绘画图像，用于展示平台的经典艺术内容呈现能力。', 'https://www.artic.edu/iiif/2/2d484387-2509-5e8e-2c43-22f9981972eb/full/843,/0/default.jpg', 'published', now(), now() + interval '30 days')
ON CONFLICT (id) DO NOTHING;

INSERT INTO curation_artworks (curation_id, artwork_id, sort_order)
VALUES
  ('30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 1),
  ('30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000002', 2),
  ('30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000003', 1),
  ('30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000004', 2),
  ('30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000005', 3),
  ('30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000006', 4)
ON CONFLICT DO NOTHING;

INSERT INTO certificates (artwork_id, issuer, certificate_no, file_url, verified_at)
VALUES
  ('20000000-0000-0000-0000-000000000001', '师比画廊鉴证', 'SB-2025-0001', 'https://example.com/certificates/SB-2025-0001.pdf', now()),
  ('20000000-0000-0000-0000-000000000002', '师比画廊鉴证', 'SB-2025-0002', 'https://example.com/certificates/SB-2025-0002.pdf', now()),
  ('20000000-0000-0000-0000-000000000003', 'Art Institute of Chicago Open Access', 'AIC-PD-27992', 'https://www.artic.edu/artworks/27992', now()),
  ('20000000-0000-0000-0000-000000000004', 'Art Institute of Chicago Open Access', 'AIC-PD-20684', 'https://www.artic.edu/artworks/20684', now()),
  ('20000000-0000-0000-0000-000000000005', 'Art Institute of Chicago Open Access', 'AIC-PD-16568', 'https://www.artic.edu/artworks/16568', now()),
  ('20000000-0000-0000-0000-000000000006', 'Art Institute of Chicago Open Access', 'AIC-PD-28560', 'https://www.artic.edu/artworks/28560', now())
ON CONFLICT (certificate_no) DO NOTHING;
