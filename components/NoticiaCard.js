import Link from 'next/link';
import '../styles/NoticiaCard.module.css';

export default function NoticiaCard({ noticia }) {
  return (
    <article className="noticiaCard glassCard">
      <Link href={`/noticia/${noticia.id}`}>
        <a className="noticiaImgWrapper">
          <img src={noticia.imagen} alt={noticia.titulo} className="noticiaImg" />
        </a>
      </Link>
      <div className="noticiaInfo">
        <span className="noticiaMeta">
          {noticia.fecha} | <Link href={`/categoria/${encodeURIComponent(noticia.categoria)}`}><a className="noticiaCategoria">{noticia.categoria}</a></Link>
        </span>
        <h3 className="noticiaTitulo">
          <Link href={`/noticia/${noticia.id}`}><a>{noticia.titulo}</a></Link>
        </h3>
        <p className="noticiaResumen">{noticia.resumen || noticia.contenido?.slice(0, 120) + '...'}</p>
        <div className="noticiaActions">
          <button className="likeBtn">👍 {noticia.likes || 0}</button>
          <button className="commentBtn">💬 {noticia.comentarios?.length || 0}</button>
        </div>
      </div>
    </article>
  );
}
