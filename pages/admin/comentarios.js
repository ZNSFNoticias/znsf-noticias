import withAdminAuth from '../../components/withAdminAuth';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

function AdminComentarios() {
  const [comentarios, setComentarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComentarios();
  }, []);

  async function fetchComentarios() {
    setLoading(true);
    const { data } = await supabase
      .from('comentarios')
      .select('*, noticias(titulo)')
      .order('fecha', { ascending: false });
    setComentarios(data || []);
    setLoading(false);
  }

  async function handleDelete(id) {
    await supabase.from('comentarios').delete().eq('id', id);
    fetchComentarios();
  }

  return (
    <div style={{padding:'2rem', maxWidth:700}}>
      <h2>Comentarios</h2>
      {loading ? <p>Cargando...</p> : (
        <ul>
          {comentarios.map(c => (
            <li key={c.id} style={{marginBottom:12, background:'#fafafa',padding:10,borderRadius:8}}>
              <b>{c.autor || 'Anónimo'}</b> en <i>{c.noticias?.titulo || 'Noticia'}</i><br/>
              <span style={{color:'#333'}}>{c.texto}</span><br/>
              <span style={{fontSize:'0.9em',color:'#888'}}>{new Date(c.fecha).toLocaleString()}</span>
              <button onClick={()=>handleDelete(c.id)} style={{marginLeft:16,color:'red'}}>Eliminar</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default withAdminAuth(AdminComentarios);
