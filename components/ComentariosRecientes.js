/*
  ComentariosRecientes.js
  ----------------------
  Componente que muestra los últimos comentarios realizados en el sitio.
  Modifica este archivo para cambiar la cantidad, el formato, o el diseño de los comentarios.
  Los estilos están en ComentariosRecientes.module.css.
*/

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import styles from '../styles/ComentariosRecientes.module.css';

export default function ComentariosRecientes() {
  // Estado para la lista de comentarios recientes
  const [comentarios, setComentarios] = useState([]);

  // Al montar, consulta los últimos 6 comentarios ordenados por fecha descendente
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
    // Caja de comentarios recientes. Cambia la estructura o estilos según tus necesidades.
    <div className={styles.comentariosBox}>
      <h3>Últimos comentarios</h3>
      <ul className={styles.comentariosList}>
        {comentarios.map((c, i) => (
          <li key={c.id} className={styles.comentario} style={{animationDelay: `${i * 0.12}s`}}>
            {/* Autor y enlace a la noticia */}
            <span className={styles.autor}>{c.autor || 'Anónimo'}</span> en{' '}
            <a href={`/noticia/${c.noticias?.id || c.noticia_id}`} className={styles.tituloNoticia}>
              {c.noticias?.titulo || 'Noticia'}
            </a>
            {/* Texto del comentario */}
            <div className={styles.texto}>{c.texto}</div>
            {/* Fecha del comentario */}
            <span className={styles.fecha}>{new Date(c.fecha).toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
