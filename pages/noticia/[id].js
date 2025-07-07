import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import styles from '../../styles/Noticia.module.css';
import '../styles/globals.css';

export default function NoticiaDetalle() {
  const router = useRouter();
  const { id } = router.query;
  const [noticia, setNoticia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likes, setLikes] = useState(0);
  const [comentarios, setComentarios] = useState([]);
  const [comentario, setComentario] = useState('');
  const [autor, setAutor] = useState('');
  const [comentLoading, setComentLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    async function fetchNoticia() {
      setLoading(true);
      const { data, error } = await supabase
        .from('noticias')
        .select('*')
        .eq('id', id)
        .single();
      if (error) setError('No se encontró la noticia');
      else {
        setNoticia(data);
        setLikes(data.likes || 0);
      }
      setLoading(false);
    }
    async function fetchComentarios() {
      const { data } = await supabase
        .from('comentarios')
        .select('*')
        .eq('noticia_id', id)
        .order('fecha', { ascending: false });
      setComentarios(data || []);
    }
    fetchNoticia();
    fetchComentarios();
  }, [id]);

  const handleLike = async () => {
    setLikes(likes + 1);
    await supabase
      .from('noticias')
      .update({ likes: likes + 1 })
      .eq('id', id);
  };

  const handleComentario = async (e) => {
    e.preventDefault();
    if (!comentario.trim()) return;
    setComentLoading(true);
    await supabase
      .from('comentarios')
      .insert({ noticia_id: id, autor: autor || 'Anónimo', texto: comentario });
    setComentario('');
    setAutor('');
    setComentLoading(false);
    // Refrescar comentarios
    const { data } = await supabase
      .from('comentarios')
      .select('*')
      .eq('noticia_id', id)
      .order('fecha', { ascending: false });
    setComentarios(data || []);
  };

  if (loading) return <p className={styles.loading}>Cargando noticia...</p>;
  if (error) return <p className={styles.error}>{error}</p>;
  if (!noticia) return null;

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.mainContent}>
        <article className={styles.article}>
          <h1>{noticia.titulo}</h1>
          <p className={styles.meta}>{noticia.fecha} | {noticia.categoria}</p>
          {noticia.imagen && <img src={noticia.imagen} alt={noticia.titulo} className={styles.imgNoticia} />}
          <p className={styles.contenido}>{noticia.contenido}</p>
          <div style={{margin:'1.5rem 0'}}>
            <button className={styles.likeBtn} onClick={handleLike}>👍 {likes}</button>
          </div>
          <section className={styles.comentariosSection}>
            <h3>Comentarios</h3>
            <form onSubmit={handleComentario} className={styles.comentarioForm}>
              <input
                type="text"
                placeholder="Tu nombre (opcional)"
                value={autor}
                onChange={e => setAutor(e.target.value)}
                className={styles.comentarioInput}
              />
              <textarea
                placeholder="Escribe un comentario..."
                value={comentario}
                onChange={e => setComentario(e.target.value)}
                className={styles.comentarioTextarea}
                required
              />
              <button type="submit" className={styles.comentarioBtn} disabled={comentLoading}>
                {comentLoading ? 'Enviando...' : 'Comentar'}
              </button>
            </form>
            <ul className={styles.comentariosList}>
              {comentarios.map(c => (
                <li key={c.id} className={styles.comentarioItem}>
                  <strong>{c.autor || 'Anónimo'}:</strong> {c.texto}
                  <span className={styles.comentarioFecha}>{new Date(c.fecha).toLocaleString()}</span>
                </li>
              ))}
              {comentarios.length === 0 && <li>No hay comentarios aún.</li>}
            </ul>
          </section>
        </article>
      </main>
      <Footer />
    </div>
  );
}
