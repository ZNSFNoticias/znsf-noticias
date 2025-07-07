import withAdminAuth from '../../components/withAdminAuth';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

function AdminCategorias() {
  const [categorias, setCategorias] = useState([]);
  const [nueva, setNueva] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategorias();
  }, []);

  async function fetchCategorias() {
    const { data } = await supabase.from('categorias').select('*').order('nombre');
    setCategorias(data || []);
  }

  async function handleAdd(e) {
    e.preventDefault();
    if (!nueva.trim()) return;
    const { error } = await supabase.from('categorias').insert({ nombre: nueva.trim() });
    if (error) setError('Error al crear categoría');
    else {
      setNueva('');
      setError(null);
      fetchCategorias();
    }
  }

  async function handleDelete(id) {
    await supabase.from('categorias').delete().eq('id', id);
    fetchCategorias();
  }

  return (
    <div style={{padding:'2rem', maxWidth:500}}>
      <h2>Categorías</h2>
      <form onSubmit={handleAdd} style={{marginBottom:'1.5rem'}}>
        <input value={nueva} onChange={e=>setNueva(e.target.value)} placeholder="Nueva categoría" style={{padding:'0.5em',width:'70%'}} />
        <button type="submit" style={{marginLeft:8}}>Agregar</button>
      </form>
      {error && <div style={{color:'red'}}>{error}</div>}
      <ul>
        {categorias.map(cat => (
          <li key={cat.id} style={{marginBottom:8}}>
            {cat.nombre} <button onClick={()=>handleDelete(cat.id)} style={{color:'red'}}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default withAdminAuth(AdminCategorias);
