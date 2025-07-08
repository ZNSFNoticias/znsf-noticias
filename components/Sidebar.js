/*
  Sidebar.js
  ----------
  Componente de barra lateral para mostrar redes sociales, noticias más vistas y categorías.
  Puedes agregar/quitar secciones, cambiar el orden, o personalizar los enlaces y estilos.
  Modifica los estilos en Sidebar.module.css.
*/

import styles from '../styles/Sidebar.module.css';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabaseClient';

export default function Sidebar() {
  // Estado para noticias más vistas y categorías únicas
  const [masVistas, setMasVistas] = useState([]);
  const [categorias, setCategorias] = useState([]);

  // Al montar, consulta las noticias más vistas y las categorías únicas
  useEffect(() => {
    async function fetchMasVistas() {
      const { data } = await supabase
        .from('noticias')
        .select('id, titulo')
        .order('likes', { ascending: false })
        .limit(3);
      setMasVistas(data || []);
    }
    async function fetchCategorias() {
      const { data } = await supabase
        .from('noticias')
        .select('categoria')
        .neq('categoria', null);
      // Extraer categorías únicas
      const cats = Array.from(new Set((data || []).map(n => n.categoria)));
      setCategorias(cats);
    }
    fetchMasVistas();
    fetchCategorias();
  }, []);

  return (
    // Barra lateral. Puedes agregar/quitar secciones según tus necesidades.
    <aside className={styles.sidebar}>
      {/* Sección de redes sociales */}
      <h2 className={styles.titulo}>Redes Sociales</h2>
      <ul className={styles.socialList}>
        <li><a href="https://www.instagram.com/znsfnoticias/" target="_blank" rel="noopener noreferrer">Instagram</a></li>
        <li><a href="https://x.com/znsfnoticias" target="_blank" rel="noopener noreferrer">Twitter (X)</a></li>
        <li><a href="https://www.youtube.com/@ZNSFNoticias" target="_blank" rel="noopener noreferrer">YouTube</a></li>
        <li><a href="https://www.tiktok.com/@znsfnoticias" target="_blank" rel="noopener noreferrer">TikTok</a></li>
      </ul>
      {/* Noticias más vistas (por likes) */}
      <h2 className={styles.titulo}>Noticias más vistas</h2>
      <ul className={styles.vistasList}>
        {masVistas.length === 0 && <li>Cargando...</li>}
        {masVistas.map(noticia => (
          <li key={noticia.id}>
            {/* Enlace a la noticia más vista */}
            <Link href={`/noticia/${noticia.id}`}>{noticia.titulo}</Link>
          </li>
        ))}
      </ul>
      {/* Categorías únicas extraídas de las noticias */}
      <h2 className={styles.titulo}>Categorías</h2>
      <ul className={styles.categoriasList}>
        {categorias.length === 0 && <li>Cargando...</li>}
        {categorias.map(cat => (
          <li key={cat}>
            {/* Enlace a la categoría */}
            <Link href={`/categoria/${encodeURIComponent(cat)}`}>{cat}</Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
