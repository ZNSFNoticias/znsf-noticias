import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import styles from '../styles/ComentariosRecientes.module.css';

export default function ComentariosRecientes() {
  const [comentarios, setComentarios] = useState([]);

  useEffect(() => {
    async function fetchComentarios() {
      const { data } = await supabase
        .from('comentarios')
        .select('*, noticias(titulo, id)')
        .order('fecha', { ascending: false })
        .limit(6);
      setComentarios(data || []);
    }
    fetchComentarios();
  }, []);

  return (
    <div className={styles.comentariosBox}>
      <h3>Últimos comentarios</h3>
      <ul className={styles.comentariosList}>
        {comentarios.map((c, i) => (
          <li key={c.id} className={styles.comentario} style={{animationDelay: `${i * 0.12}s`}}>
            <span className={styles.autor}>{c.autor || 'Anónimo'}</span> en{' '}
            <a href={`/noticia/${c.noticias?.id || c.noticia_id}`} className={styles.tituloNoticia}>
              {c.noticias?.titulo || 'Noticia'}
            </a>
            <div className={styles.texto}>{c.texto}</div>
            <span className={styles.fecha}>{new Date(c.fecha).toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
