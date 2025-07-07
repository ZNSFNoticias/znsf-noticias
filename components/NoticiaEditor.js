import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

// Utilidad para convertir links de YouTube y SoundCloud
function normalizarMediaUrl(tipo, url) {
  if (tipo === 'video') {
    // YouTube: acepta /watch?v=, /shorts/, /youtu.be/ y convierte a /embed/VIDEO_ID
    const match = url.match(/(?:v=|youtu.be\/|shorts\/|embed\/)([\w-]+)/);
    if (match) return `https://www.youtube.com/embed/${match[1]}`;
  }
  if (tipo === 'audio') {
    // SoundCloud: solo la parte base
    return url.split('?')[0];
  }
  return url;
}

export default function NoticiaEditor({ noticiaId }) {
  const [categorias, setCategorias] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [fecha, setFecha] = useState('');
  const [resumen, setResumen] = useState('');
  const [contenido, setContenido] = useState('');
  const [medias, setMedias] = useState([]); // {tipo, url, descripcion, orden}
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function fetchCategorias() {
      const { data } = await supabase.from('categorias').select('*').order('nombre');
      setCategorias(data || []);
    }
    fetchCategorias();
    if (noticiaId) fetchNoticia();
  }, [noticiaId]);

  async function fetchNoticia() {
    const { data } = await supabase.from('noticias').select('*').eq('id', noticiaId).single();
    if (data) {
      setTitulo(data.titulo);
      setCategoriaId(data.categoria_id || '');
      setFecha(data.fecha);
      setResumen(data.resumen || '');
      setContenido(data.contenido || '');
      // Cargar medias
      const { data: m } = await supabase.from('noticia_media').select('*').eq('noticia_id', noticiaId).order('orden');
      setMedias(m || []);
    }
  }

  function handleAddMedia() {
    setMedias([...medias, { tipo: 'imagen', url: '', descripcion: '', orden: medias.length + 1 }]);
  }
  function handleMediaChange(i, field, value) {
    const arr = [...medias];
    arr[i][field] = value;
    if (field === 'url') arr[i].url = normalizarMediaUrl(arr[i].tipo, value);
    setMedias(arr);
  }
  function handleMediaTipo(i, tipo) {
    const arr = [...medias];
    arr[i].tipo = tipo;
    arr[i].url = normalizarMediaUrl(tipo, arr[i].url);
    setMedias(arr);
  }
  function handleRemoveMedia(i) {
    setMedias(medias.filter((_, idx) => idx !== i));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    if (!titulo || !categoriaId || !fecha || !contenido) {
      setError('Completa todos los campos obligatorios');
      return;
    }
    let noticia;
    if (noticiaId) {
      const { data, error } = await supabase
        .from('noticias')
        .update({ titulo, categoria_id: categoriaId, fecha, resumen, contenido })
        .eq('id', noticiaId)
        .select()
        .single();
      if (error) { setError('Error al actualizar noticia'); return; }
      noticia = data;
      await supabase.from('noticia_media').delete().eq('noticia_id', noticiaId);
    } else {
      const { data, error } = await supabase
        .from('noticias')
        .insert({ titulo, categoria_id: categoriaId, fecha, resumen, contenido })
        .select()
        .single();
      if (error) { setError('Error al crear noticia'); return; }
      noticia = data;
    }
    // Insertar medias
    for (let i = 0; i < medias.length; i++) {
      const m = medias[i];
      await supabase.from('noticia_media').insert({
        noticia_id: noticia.id,
        url: normalizarMediaUrl(m.tipo, m.url),
        tipo: m.tipo,
        descripcion: m.descripcion,
        orden: i + 1
      });
    }
    setSuccess(true);
    setTimeout(()=>setSuccess(false), 2000);
  }

  return (
    <div style={{padding:'2rem',maxWidth:900}}>
      <h2>{noticiaId ? 'Editar Noticia' : 'Nueva Noticia'}</h2>
      <form onSubmit={handleSubmit}>
        <div style={{marginBottom:12}}>
          <input value={titulo} onChange={e=>setTitulo(e.target.value)} placeholder="Título" style={{width:'100%',padding:8}} required />
        </div>
        <div style={{marginBottom:12}}>
          <select value={categoriaId} onChange={e=>setCategoriaId(e.target.value)} required style={{padding:8}}>
            <option value="">Selecciona categoría</option>
            {categorias.map(cat => <option key={cat.id} value={cat.id}>{cat.nombre}</option>)}
          </select>
        </div>
        <div style={{marginBottom:12}}>
          <input type="date" value={fecha} onChange={e=>setFecha(e.target.value)} required style={{padding:8}} />
        </div>
        <div style={{marginBottom:12}}>
          <textarea value={resumen} onChange={e=>setResumen(e.target.value)} placeholder="Resumen (opcional)" style={{width:'100%',padding:8,minHeight:40}} />
        </div>
        <div style={{marginBottom:12}}>
          <textarea value={contenido} onChange={e=>setContenido(e.target.value)} placeholder="Cuerpo de la noticia (puedes usar HTML básico para estilos, links, etc.)" style={{width:'100%',padding:8,minHeight:120}} required />
          <div style={{fontSize:'0.95em',color:'#888'}}>Puedes usar etiquetas HTML como &lt;b&gt;, &lt;i&gt;, &lt;a&gt;, &lt;ul&gt;, &lt;img&gt;, etc.</div>
        </div>
        <div style={{marginBottom:18}}>
          <h4>Galería de Medios</h4>
          {medias.map((m, i) => (
            <div key={i} style={{display:'flex',gap:8,alignItems:'center',marginBottom:8}}>
              <select value={m.tipo} onChange={e=>handleMediaTipo(i, e.target.value)} style={{padding:4}}>
                <option value="imagen">Imagen</option>
                <option value="video">Video</option>
                <option value="audio">Audio</option>
              </select>
              <input value={m.url} onChange={e=>handleMediaChange(i,'url',e.target.value)} placeholder="URL" style={{width:220}} />
              <input value={m.descripcion} onChange={e=>handleMediaChange(i,'descripcion',e.target.value)} placeholder="Descripción" style={{width:120}} />
              <button type="button" onClick={()=>handleRemoveMedia(i)} style={{color:'red'}}>Eliminar</button>
            </div>
          ))}
          <button type="button" onClick={handleAddMedia} style={{marginTop:8}}>+ Agregar media</button>
        </div>
        <button type="submit" style={{background:'#d60000',color:'#fff',padding:'10px 28px',borderRadius:8,fontSize:'1.1em'}}>Guardar</button>
        {error && <div style={{color:'red',marginTop:10}}>{error}</div>}
        {success && <div style={{color:'green',marginTop:10}}>¡Guardado!</div>}
      </form>
    </div>
  );
}
