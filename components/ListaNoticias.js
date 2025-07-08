/*
  ListaNoticias.js
  ----------------
  Componente que muestra una lista de todas las noticias usando NoticiaCard.
  Realiza la consulta a la base de datos y maneja estados de carga y error.
  Modifica este archivo para cambiar la lógica de consulta, el orden, o el diseño de la lista.
*/

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import Link from 'next/link';
import NoticiaCard from './NoticiaCard';

export default function ListaNoticias() {
  // Estado para noticias, loading y error
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Al montar, consulta todas las noticias ordenadas por fecha descendente
  useEffect(() => {
    async function fetchNoticias() {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('noticias')
        .select('*, categorias(nombre)')
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

  // Mensaje de carga
  if (loading) return <p>Cargando noticias...</p>;
  // Mensaje de error
  if (error) return <p>{error}</p>;
  // Mensaje si no hay noticias
  if (!noticias.length) return <p>No hay noticias disponibles.</p>;

  return (
    // Renderiza cada noticia como un link con su tarjeta
    <div>
      {noticias.map(noticia => (
        <Link key={noticia.id} href={`/noticia/${noticia.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <a style={{display:'block'}}><NoticiaCard noticia={noticia} /></a>
        </Link>
      ))}
    </div>
  );
}
