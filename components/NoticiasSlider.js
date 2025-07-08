import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';
import styles from '../styles/Slider.module.css';

export default function NoticiasSlider() {
  const [noticias, setNoticias] = useState([]);
  const [active, setActive] = useState(0);
  const router = useRouter();

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
      {noticias.map((n, i) => (
        <div
          key={n.id}
          className={styles.slide + (i === active ? ' ' + styles.active : '')}
          style={{ backgroundImage: `url(${n.imagen})` }}
          onClick={() => router.push(`/noticia/${n.id}`)}
          role="button"
          tabIndex={0}
          onKeyPress={e => { if (e.key === 'Enter') router.push(`/noticia/${n.id}`); }}
        >
          <div className={styles.overlay} />
          <div className={styles.info}>
            <span
              className={styles.categoria}
              onClick={e => { e.stopPropagation(); router.push(`/categoria/${encodeURIComponent(n.categoria)}`); }}
              style={{ cursor: 'pointer' }}
            >
              {n.categoria}
            </span>
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
