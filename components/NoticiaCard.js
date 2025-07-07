import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import Link from 'next/link';
import '../styles/NoticiaCard.module.css';

export default function NoticiaCard({ noticia }) {
  const [comentCount, setComentCount] = useState(0);

  useEffect(() => {
    async function fetchCount() {
      const { count } = await supabase
        .from('comentarios')
        .select('*', { count: 'exact', head: true })
        .eq('noticia_id', noticia.id);
      setComentCount(count || 0);
    }
    fetchCount();
  }, [noticia.id]);

  return (
    <article className="noticiaCard glassCard">
      <Link href={`/noticia/${noticia.id}`}>
        <a className="noticiaImgWrapper">
          <img src={noticia.imagen} alt={noticia.titulo} className="noticiaImg" />
        </a>
      </Link>
      <div className="noticiaInfo">
        <span className="noticiaMeta">
          {noticia.fecha} | <Link href={`/categoria/${encodeURIComponent(noticia.categoria)}`}><a className="noticiaCategoria">{noticia.categoria}</a></Link> | 👁️ {noticia.vistas || 0} vistas
        </span>
        <h3 className="noticiaTitulo">
          <Link href={`/noticia/${noticia.id}`}><a>{noticia.titulo}</a></Link>
        </h3>
        <p className="noticiaResumen">{noticia.resumen || noticia.contenido?.slice(0, 120) + '...'}</p>
        <div className="noticiaActions">
          <button className="likeBtn">👍 {noticia.likes || 0}</button>
          <button className="commentBtn">💬 {comentCount}</button>
        </div>
      </div>
    </article>
  );
}
