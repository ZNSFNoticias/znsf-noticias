import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';
import styles from '../styles/Slider.module.css';

// Slider de noticias destacadas en la portada
// Muestra hasta 5 noticias, con imagen, categoría, título y resumen
export default function NoticiasSlider() {
  const [noticias, setNoticias] = useState([]); // Lista de noticias destacadas
  const [active, setActive] = useState(0); // Índice del slide activo
  const router = useRouter();

  // Cargar noticias destacadas al montar el componente
  useEffect(() => {
    async function fetchDestacadas() {
      const { data } = await supabase
        .from('noticias')
        .select('*')
        .order('fecha', { ascending: false })
        .limit(5);
      setNoticias(data || []);
    }
    fetchDestacadas();
  }, []);

  // Cambia de slide automáticamente cada 4 segundos
  useEffect(() => {
    if (noticias.length < 2) return;
    const interval = setInterval(() => {
      setActive(a => (a + 1) % noticias.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [noticias]);

  if (!noticias.length) return null;

  return (
    <div className={styles.slider}>
      {/* Renderiza cada noticia como un slide */}
      {noticias.map((n, i) => (
        <div
          key={n.id}
          className={styles.slide + (i === active ? ' ' + styles.active : '')}
          style={{ backgroundImage: `url(${n.imagen})` }}
          onClick={() => router.push(`/noticia/${n.id}`)} // Click en el slide lleva a la noticia
          role="button"
          tabIndex={0}
          onKeyPress={e => { if (e.key === 'Enter') router.push(`/noticia/${n.id}`); }}
        >
          <div className={styles.overlay} />
          <div className={styles.info}>
            {/* Click en la categoría lleva a la página de esa categoría */}
            <span
              className={styles.categoria}
              onClick={e => { e.stopPropagation(); router.push(`/categoria/${encodeURIComponent(n.categoria)}`); }}
              style={{ cursor: 'pointer' }}
            >
              {n.categoria}
            </span>
            {/* Título de la noticia */}
            <h2 className={styles.titulo}>{n.titulo}</h2>
            {/* Resumen HTML seguro */}
            {n.resumen ? (
              <div
                className={styles.resumen}
                dangerouslySetInnerHTML={{ __html: n.resumen }}
              />
            ) : (
              <div
                className={styles.resumen}
                dangerouslySetInnerHTML={{ __html: (n.contenido || '').slice(0, 120) + '...'}}
              />
            )}
          </div>
        </div>
      ))}
      {/* Dots de navegación para cambiar de slide manualmente */}
      <div className={styles.dots}>
        {noticias.map((_, i) => (
          <span
            key={i}
            className={i === active ? styles.dotActive : styles.dot}
            onClick={() => setActive(i)}
          />
        ))}
      </div>
    </div>
  );
}
