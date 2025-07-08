/*
  NoticiaCard.js
  --------------
  Componente de tarjeta para mostrar una noticia individual en listados, portadas, etc.
  Incluye imagen, título, resumen, categoría, fecha, vistas, likes y comentarios.
  Modifica este archivo para cambiar la estructura visual, agregar/quitar datos, o personalizar la interacción.
*/

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import Link from 'next/link';
import styles from '../styles/NoticiaCard.module.css';

export default function NoticiaCard({ noticia }) {
  // Estado para cantidad de comentarios y vistas en tiempo real
  const [comentCount, setComentCount] = useState(0);
  const [vistas, setVistas] = useState(noticia.vistas || 0);

  // Al montar, consulta cantidad de comentarios y vistas, y actualiza cada 5s
  useEffect(() => {
    async function fetchCount() {
      const { count } = await supabase
        .from('comentarios')
        .select('*', { count: 'exact', head: true })
        .eq('noticia_id', noticia.id);
      setComentCount(count || 0);
    }
    async function fetchVistas() {
      const { data } = await supabase
        .from('noticias')
        .select('vistas')
        .eq('id', noticia.id)
        .single();
      if (data && typeof data.vistas === 'number') setVistas(data.vistas);
    }
    fetchCount();
    fetchVistas();
    // Polling para refrescar vistas cada 5s
    const interval = setInterval(fetchVistas, 5000);
    return () => clearInterval(interval);
  }, [noticia.id]);

  return (
    // Tarjeta visual de la noticia. Cambia las clases o estructura para modificar el diseño.
    <article className={styles.noticiaCard + ' glassCard'}>
      {/* Imagen principal de la noticia. Click lleva a la noticia. */}
      <Link href={`/noticia/${noticia.id}`}>
        <a className={styles.noticiaImgWrapper} tabIndex={-1}>
          <img src={noticia.imagen} alt={noticia.titulo} className={styles.noticiaImg} />
        </a>
      </Link>
      <div className={styles.noticiaInfo}>
        {/* Meta: fecha, categoría, vistas */}
        <span className={styles.noticiaMeta}>
          {noticia.fecha} | <Link href={`/categoria/${encodeURIComponent(noticia.categorias?.nombre || noticia.categoria)}`}><a className={styles.noticiaCategoria}>{noticia.categorias?.nombre || noticia.categoria}</a></Link> | <span className={styles.vistas}><span role="img" aria-label="vistas">👁️</span> {vistas} vistas</span>
        </span>
        {/* Título de la noticia */}
        <h3 className={styles.noticiaTitulo + ' animatedTitle'}>
          <Link href={`/noticia/${noticia.id}`}><a>{noticia.titulo}</a></Link>
        </h3>
        {/* Resumen HTML seguro. Si no hay resumen, muestra los primeros 120 caracteres del contenido. */}
        {noticia.resumen ? (
          <div
            className={styles.noticiaResumen + ' animatedResumen'}
            dangerouslySetInnerHTML={{ __html: noticia.resumen }}
          />
        ) : (
          <div
            className={styles.noticiaResumen + ' animatedResumen'}
            dangerouslySetInnerHTML={{ __html: (noticia.contenido || '').slice(0, 120) + '...'}}
          />
        )}
        {/* Acciones: likes y comentarios */}
        <div className={styles.noticiaActions}>
          <button className={styles.likeBtn}>👍 {noticia.likes || 0}</button>
          <button className={styles.commentBtn}>💬 {comentCount}</button>
        </div>
      </div>
    </article>
  );
}
