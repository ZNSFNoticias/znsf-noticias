-- Tabla para múltiples imágenes y videos por noticia
CREATE TABLE IF NOT EXISTS noticia_media (
  id bigserial PRIMARY KEY,
  noticia_id bigint REFERENCES noticias(id) ON DELETE CASCADE,
  url text NOT NULL,
  tipo text CHECK (tipo IN ('imagen', 'video')) NOT NULL DEFAULT 'imagen',
  descripcion text,
  orden integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

-- Función para incrementar vistas (si usas Postgres en Supabase)
CREATE OR REPLACE FUNCTION increment(x integer)
RETURNS integer AS $$
  SELECT x + 1;
$$ LANGUAGE SQL IMMUTABLE;
