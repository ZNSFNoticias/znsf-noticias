-- Esquema completo de la base de datos extraído del backup

-- Tabla categorias
CREATE TABLE public.categorias (
    id integer NOT NULL,
    nombre text NOT NULL,
    editado_por integer,
    creado timestamp with time zone DEFAULT now(),
    editado timestamp with time zone
);

ALTER TABLE public.categorias ADD CONSTRAINT categorias_pkey PRIMARY KEY (id);

-- Tabla usuarios
CREATE TABLE public.usuarios (
    id integer NOT NULL,
    nombre text NOT NULL,
    password_hash text NOT NULL
);

ALTER TABLE public.usuarios ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);
ALTER TABLE public.usuarios ADD CONSTRAINT usuarios_nombre_key UNIQUE (nombre);

-- Tabla noticias
CREATE TABLE public.noticias (
    id bigint NOT NULL,
    titulo text NOT NULL,
    contenido text NOT NULL,
    fecha date NOT NULL,
    categoria text NOT NULL,
    imagen text,
    autor text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    likes integer DEFAULT 0,
    vistas integer DEFAULT 0,
    categoria_id integer,
    autor_id integer,
    editor_id integer,
    creado timestamp with time zone DEFAULT now(),
    editado timestamp with time zone
);

ALTER TABLE public.noticias ADD CONSTRAINT noticias_pkey PRIMARY KEY (id);
ALTER TABLE public.noticias ADD CONSTRAINT fk_noticias_autor FOREIGN KEY (autor_id) REFERENCES public.usuarios(id);
ALTER TABLE public.noticias ADD CONSTRAINT fk_noticias_editor FOREIGN KEY (editor_id) REFERENCES public.usuarios(id);
ALTER TABLE public.noticias ADD CONSTRAINT noticias_autor_id_fkey FOREIGN KEY (autor_id) REFERENCES public.usuarios(id);
ALTER TABLE public.noticias ADD CONSTRAINT noticias_categoria_id_fkey FOREIGN KEY (categoria_id) REFERENCES public.categorias(id);
ALTER TABLE public.noticias ADD CONSTRAINT noticias_editor_id_fkey FOREIGN KEY (editor_id) REFERENCES public.usuarios(id);

-- Tabla comentarios
CREATE TABLE public.comentarios (
    id bigint NOT NULL,
    noticia_id bigint,
    autor text,
    texto text NOT NULL,
    fecha timestamp with time zone DEFAULT now(),
    eliminado_por integer,
    eliminado timestamp with time zone
);

ALTER TABLE public.comentarios ADD CONSTRAINT comentarios_pkey PRIMARY KEY (id);
ALTER TABLE public.comentarios ADD CONSTRAINT comentarios_noticia_id_fkey FOREIGN KEY (noticia_id) REFERENCES public.noticias(id) ON DELETE CASCADE;

-- Tabla noticia_media
CREATE TABLE public.noticia_media (
    id bigint NOT NULL,
    noticia_id bigint,
    url text NOT NULL,
    tipo text DEFAULT 'imagen'::text NOT NULL,
    descripcion text,
    orden integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT noticia_media_tipo_check CHECK ((tipo = ANY (ARRAY['imagen'::text, 'video'::text, 'audio'::text])))
);

ALTER TABLE public.noticia_media ADD CONSTRAINT noticia_media_pkey PRIMARY KEY (id);
ALTER TABLE public.noticia_media ADD CONSTRAINT noticia_media_noticia_id_fkey FOREIGN KEY (noticia_id) REFERENCES public.noticias(id) ON DELETE CASCADE;

-- Tabla admin_logs
CREATE TABLE public.admin_logs (
    id integer NOT NULL,
    usuario_id integer,
    accion text NOT NULL,
    entidad text NOT NULL,
    entidad_id integer,
    descripcion text,
    fecha timestamp with time zone DEFAULT now()
);

ALTER TABLE public.admin_logs ADD CONSTRAINT admin_logs_pkey PRIMARY KEY (id);
ALTER TABLE public.admin_logs ADD CONSTRAINT admin_logs_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id);

-- Función para incrementar vistas
CREATE OR REPLACE FUNCTION increment(x integer)
RETURNS integer AS $$
  SELECT x + 1;
$$ LANGUAGE SQL IMMUTABLE;