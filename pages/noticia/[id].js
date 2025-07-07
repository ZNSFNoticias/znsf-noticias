import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ComentariosRecientes from '../../components/ComentariosRecientes';
import Sidebar from '../../components/Sidebar';
import styles from '../../styles/Noticia.module.css';

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
  const [vistas, setVistas] = useState(0);
  const [media, setMedia] = useState([]);
  const [lightboxImg, setLightboxImg] = useState(null);

  useEffect(() => {
    if (!id) return;
    async function fetchNoticia() {
      setLoading(true);
      // Sumar +1 a vistas
      await supabase
        .from('noticias')
        .update({ vistas: supabase.rpc('increment', { x: 1 }) })
        .eq('id', id);
      // Obtener noticia actualizada
      const { data, error } = await supabase
        .from('noticias')
        .select('*')
        .eq('id', id)
        .single();
      if (error) setError('No se encontró la noticia');
      else {
        setNoticia(data);
        setLikes(data.likes || 0);
        setVistas(data.vistas || 0);
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
    async function fetchMedia() {
      const { data } = await supabase
        .from('noticia_media')
        .select('*')
        .eq('noticia_id', id)
        .order('orden', { ascending: true });
      setMedia(data || []);
    }
    fetchNoticia();
    fetchComentarios();
    fetchMedia();
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

  // Selección de portada y multimedia
  const portada = media.find(m => m.tipo === 'imagen' && m.orden === 1);
  const imagenes = media.filter(m => m.tipo === 'imagen' && m.orden !== 1);
  // Validar y transformar URLs de video/audio si es necesario
  let video = media.find(m => m.tipo === 'video');
  let audio = media.find(m => m.tipo === 'audio');
  // YouTube: transformar a formato embed si es necesario
  if (video && video.url && !video.url.includes('/embed/')) {
    const match = video.url.match(/(?:v=|youtu.be\/|youtube.com\/watch\?v=)([\w-]+)/);
    if (match) video = { ...video, url: `https://www.youtube.com/embed/${match[1]}` };
  }
  // SoundCloud: transformar a formato embed si es necesario
  if (audio && audio.url && !audio.url.includes('player.soundcloud.com')) {
    audio = { ...audio, url: `https://w.soundcloud.com/player/?url=${encodeURIComponent(audio.url)}` };
  }

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.mainContent}>
        <div className={styles.leftCol}>
          <Sidebar />
          <ComentariosRecientes />
        </div>
        <div className={styles.rightCol}>
          <button className={styles.backBtn} onClick={() => router.back()}>&larr; Volver</button>
          <article className={styles.article}>
            <h1 className={styles.titulo}>{noticia.titulo}</h1>
            <p className={styles.meta}>{noticia.fecha} | {noticia.categoria} | 👁️ {vistas} vistas</p>
            {/* Portada */}
            {portada && (
              <div className={styles.imgWrapper}>
                <img src={portada.url} alt={noticia.titulo} className={styles.imgNoticia} onClick={() => setLightboxImg(portada.url)} style={{cursor:'zoom-in'}} />
              </div>
            )}
            {/* Galería de imágenes */}
            {imagenes.length > 0 && (
              <div className={styles.galeria}>
                {imagenes.map(img => (
                  <img
                    key={img.id}
                    src={img.url}
                    alt={img.descripcion || noticia.titulo}
                    className={styles.imgGaleria}
                    onClick={() => setLightboxImg(img.url)}
                    style={{cursor:'zoom-in'}}
                  />
                ))}
              </div>
            )}
            {/* Lightbox */}
            {lightboxImg && (
              <div className={styles.lightbox} onClick={() => setLightboxImg(null)}>
                <img src={lightboxImg} alt="Imagen ampliada" className={styles.lightboxImg} />
                <button className={styles.lightboxClose} onClick={() => setLightboxImg(null)}>&times;</button>
              </div>
            )}
            {/* Video */}
            {video && (
              <div>
                <iframe
                  className={styles.mediaFrame}
                  height="320"
                  src={video.url}
                  title={video.descripcion || 'Video'}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            )}
            {/* Audio */}
            {audio && (
              <div>
                <iframe
                  className={styles.mediaFrame}
                  height="120"
                  src={audio.url}
                  title={audio.descripcion || 'Audio'}
                  frameBorder="0"
                  allow="autoplay"
                ></iframe>
              </div>
            )}
            <p className={styles.contenido}>{noticia.contenido}</p>
            <div className={styles.likeSection}>
              <button className={styles.likeBtn} onClick={handleLike}>👍 {likes}</button>
            </div>
            <section className={styles.comentariosSection}>
              <h3>Comentarios</h3>
              <form onSubmit={handleComentario} className={styles.comentarioForm}>
                <input
                  type="text"
                  placeholder="Tu nombre (opcional)"
                  value={autor}
                  onChange={e => setAutor(e.target.value.slice(0, 40))}
                  className={styles.comentarioInput}
                  maxLength={10}
                />
                <textarea
                  placeholder="Escribe un comentario..."
                  value={comentario}
                  onChange={e => setComentario(e.target.value.slice(0, 500))}
                  className={styles.comentarioTextarea}
                  required
                  maxLength={500}
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
        </div>
      </main>
      <Footer />
    </div>
  );
}
