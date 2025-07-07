import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import styles from '../../styles/Categoria.module.css';
import NoticiaCard from '../../components/NoticiaCard';

export default function Categoria() {
  const router = useRouter();
  const { categoria } = router.query;
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!categoria) return;
    async function fetchNoticias() {
      setLoading(true);
      const { data, error } = await supabase
        .from('noticias')
        .select('*')
        .eq('categoria', categoria)
        .order('fecha', { ascending: false });
      if (error) setError('Error al cargar noticias');
      else setNoticias(data);
      setLoading(false);
    }
    fetchNoticias();
  }, [categoria]);

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.mainContent}>
        <h2 className={styles.titulo}>Noticias de {categoria}</h2>
        {loading && <p className={styles.loading}>Cargando...</p>}
        {error && <p className={styles.error}>{error}</p>}
        {!loading && !error && noticias.length === 0 && <p>No hay noticias en esta categoría.</p>}
        <div>
          {noticias.map(noticia => (
            <NoticiaCard key={noticia.id} noticia={noticia} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
