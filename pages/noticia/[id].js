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
  const [hasLiked, setHasLiked] = useState(false);

  useEffect(() => {
    if (!id) return;
    async function fetchNoticia() {
      setLoading(true);
      // sumar +1 a vistas: intentar RPC (si existe) y siempre tener respaldo
      const parsedId = parseInt(id, 10);
      let incremented = false;
      try {
        const { data, error: rpcError } = await supabase.rpc('incrementar_vista', { noticia_id: parsedId });
        if (rpcError) {
          // si la llamada devuelve error, vamos al fallback
          console.warn('RPC incrementar_vista no disponible o falló:', rpcError.message);
        } else {
          // en caso de que la RPC exista y no devuelva error, consideramos el incremento hecho
          incremented = true;
        }
      } catch (e) {
        // la RPC no existe o hubo otro fallo (por ejemplo permisos o SQL mal escrito)
        console.warn('RPC incrementar_vista lanzó excepción, usaremos fallback:', e.message || e);
      }
      if (!incremented) {
        try {
          await supabase
            .from('noticias')
            .update({})
            .eq('id', parsedId)
            .increment('vistas', 1);
        } catch (e) {
          console.error('Fallback de incremento de vistas falló también:', e);
        }
      }
      // Obtener noticia actualizada con join a categorias
      const { data, error } = await supabase
        .from('noticias')
        .select('*, categorias(nombre)')
        .eq('id', parsedId)
        .single();
      if (error) {
        setError('No se encontró la noticia');
      } else {
        setNoticia(data);
        setLikes(data.likes || 0);
        // siempre convertir a número para evitar strings que bloquean la actualización
        setVistas(data.vistas != null ? Number(data.vistas) : 0);
      }
      setLoading(false);
    }
    async function fetchComentarios() {
      const parsedId = parseInt(id, 10);
      const { data } = await supabase
        .from('comentarios')
        .select('*')
        .eq('noticia_id', parsedId)
        .order('fecha', { ascending: false });
      setComentarios(data || []);
    }
    async function fetchMedia() {
      const parsedId = parseInt(id, 10);
      const { data } = await supabase
        .from('noticia_media')
        .select('*')
        .eq('noticia_id', parsedId)
        .order('orden', { ascending: true });
      setMedia(data || []);
    }
    fetchNoticia();
    fetchComentarios();
    fetchMedia();
  }, [id]);

  // Control de likes por navegador
  useEffect(() => {
    if (!id) return;
    if (typeof window !== 'undefined') {
      setHasLiked(localStorage.getItem(`like_noticia_${id}`) === '1');
    }
  }, [id]);

  const handleLike = async () => {
    if (hasLiked) return;
    setLikes(likes + 1);
    setHasLiked(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem(`like_noticia_${id}`, '1');
    }
    const parsedId = parseInt(id, 10);
    await supabase
      .from('noticias')
      .update({ likes: likes + 1 })
      .eq('id', parsedId);
  };

  const handleComentario = async (e) => {
    e.preventDefault();
    if (!comentario.trim()) return;
    setComentLoading(true);
    // Obtener el próximo ID
    const { data: maxId } = await supabase.from('comentarios').select('id').order('id', { ascending: false }).limit(1);
    const nextId = maxId && maxId.length > 0 ? maxId[0].id + 1 : 1;
    const parsedId = parseInt(id, 10);
    const { error } = await supabase
      .from('comentarios')
      .insert({ id: nextId, noticia_id: parsedId, autor: autor || 'Anónimo', texto: comentario });
    if (error) {
      alert('Error al enviar comentario: ' + error.message);
      setComentLoading(false);
      return;
    }
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
          <button className={styles.backBtn} onClick={() => router.push('/')}>Volver al inicio</button>
          <article className={styles.article}>
            <h1 className={styles.titulo}>{noticia.titulo}</h1>
            <p className={styles.meta}>{noticia.fecha} | {noticia.categorias?.nombre || noticia.categoria} | 👁️ {vistas} vistas</p>
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
            {/* Cuerpo de la noticia como HTML seguro */}
            <div
              className={styles.contenido}
              dangerouslySetInnerHTML={{ __html: noticia.contenido }}
            />
            <div className={styles.likeSection}>
              <button className={styles.likeBtn} onClick={handleLike} disabled={hasLiked}>👍 {likes}</button>
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
                  maxLength={20}
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
