import withAdminAuth from '../../components/withAdminAuth';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import Link from 'next/link';

function AdminNoticias() {
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNoticias();
  }, []);

  async function fetchNoticias() {
    setLoading(true);
    const { data } = await supabase
      .from('noticias')
      .select('*, categorias(nombre)')
      .order('fecha', { ascending: false });
    setNoticias(data || []);
    setLoading(false);
  }

  async function handleDelete(id) {
    await supabase.from('noticias').delete().eq('id', id);
    fetchNoticias();
  }

  return (
    <div style={{padding:'2rem', maxWidth:900}}>
      <h2>Noticias</h2>
      <Link href="/admin/nueva-noticia"><a style={{marginBottom:16,display:'inline-block',background:'#d60000',color:'#fff',padding:'8px 18px',borderRadius:8}}>+ Nueva noticia</a></Link>
      {loading ? <p>Cargando...</p> : (
        <table style={{width:'100%',marginTop:16}}>
          <thead>
            <tr style={{background:'#fafafa'}}>
              <th>Título</th>
              <th>Categoría</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {noticias.map(n => (
              <tr key={n.id}>
                <td>{n.titulo}</td>
                <td>{n.categorias?.nombre || n.categoria}</td>
                <td>{n.fecha}</td>
                <td>
                  <Link href={`/admin/editar-noticia/${n.id}`}><a style={{marginRight:8}}>Editar</a></Link>
                  <button onClick={()=>handleDelete(n.id)} style={{color:'red'}}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default withAdminAuth(AdminNoticias);
