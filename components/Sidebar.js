import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabaseClient';

export default function Sidebar() {
  const [masVistas, setMasVistas] = useState([]);
  const [categorias, setCategorias] = useState([]);

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
    <aside style={{background:'#f5f5f5',padding:'1rem',minWidth:'220px',marginRight:'2rem',borderRadius:'10px',boxShadow:'0 2px 12px #0001'}}>
      <h2 style={{color:'#d60000'}}>Redes Sociales</h2>
      <ul style={{listStyle:'none',padding:0}}>
        <li><a href="https://www.instagram.com/znsfnoticias/" target="_blank" rel="noopener noreferrer">Instagram</a></li>
        <li><a href="https://x.com/znsfnoticias" target="_blank" rel="noopener noreferrer">Twitter (X)</a></li>
        <li><a href="https://www.youtube.com/@ZNSFNoticias" target="_blank" rel="noopener noreferrer">YouTube</a></li>
        <li><a href="https://www.tiktok.com/@znsfnoticias" target="_blank" rel="noopener noreferrer">TikTok</a></li>
      </ul>
      <h2 style={{color:'#d60000',marginTop:'2rem'}}>Noticias más vistas</h2>
      <ul style={{listStyle:'none',padding:0}}>
        {masVistas.length === 0 && <li>Cargando...</li>}
        {masVistas.map(noticia => (
          <li key={noticia.id}>
            <Link href={`/noticia/${noticia.id}`}><a>{noticia.titulo}</a></Link>
          </li>
        ))}
      </ul>
      <h2 style={{color:'#d60000',marginTop:'2rem'}}>Categorías</h2>
      <ul style={{listStyle:'none',padding:0}}>
        {categorias.length === 0 && <li>Cargando...</li>}
        {categorias.map(cat => (
          <li key={cat}><Link href={`/categoria/${encodeURIComponent(cat)}`}><a>{cat}</a></Link></li>
        ))}
      </ul>
    </aside>
  );
}
