import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import NoticiaCard from './NoticiaCard';

export default function ListaNoticias() {
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchNoticias() {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('noticias')
        .select('*')
        .order('fecha', { ascending: false });
      if (error) {
        setError('Error al cargar noticias');
        setNoticias([]);
      } else {
        setNoticias(data);
      }
      setLoading(false);
    }
    fetchNoticias();
  }, []);

  if (loading) return <p>Cargando noticias...</p>;
  if (error) return <p>{error}</p>;
  if (!noticias.length) return <p>No hay noticias disponibles.</p>;

  return (
    <div>
      {noticias.map(noticia => (
        <NoticiaCard key={noticia.id} noticia={noticia} />
      ))}
    </div>
  );
}
