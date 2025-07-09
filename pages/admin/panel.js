// -----------------------------------------------------------------------------
// PÁGINA: pages/admin/panel.js
// -----------------------------------------------------------------------------
// Panel de administración principal para ZNSF Noticias.
// Permite login, gestión y edición avanzada de noticias, categorías, comentarios y usuarios.
//
// Personalización y guía:
// - Cambia la lógica de login en handleLogin (hash, campos, validación).
// - Modifica los formularios de noticias, categorías y comentarios según tus necesidades.
// - Puedes agregar nuevos campos, validaciones o secciones de administración.
// - El editor visual usa ReactQuill (puedes cambiar la toolbar en quillModules).
// - Para agregar nuevos tipos de media, edita la función addMediaRow y el renderizado.
// - Los estilos inline pueden migrarse a CSS Modules para mayor control visual.
//
// Referencias:
// - Para cambiar la estructura de la base de datos, revisa las consultas a supabase.
// - Para agregar roles o permisos, modifica withAdminAuth y la lógica de login.
// - Para internacionalización, reemplaza los textos fijos por variables o recursos.
// -----------------------------------------------------------------------------

import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import withAdminAuth from '../../components/withAdminAuth';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css'; // Estilos del editor visual
import 'quill-emoji/dist/quill-emoji.css'; // Estilos de emojis para el editor

// Carga ReactQuill solo en cliente (Next.js SSR safe)
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

// Registro de plugins de emoji solo en cliente
if (typeof window !== 'undefined') {
  const Quill = require('react-quill').Quill;
  if (Quill && !Quill.imports['modules/emoji-toolbar']) {
    require('quill-emoji');
  }
}

// Configuración de la toolbar y módulos del editor visual
const quillModules = {
  toolbar: {
    container: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'font': [] }],
      [{ 'align': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'indent': '-1'}, { 'indent': '+1' }],
      ['link', 'image', 'video', 'formula', 'emoji'],
      ['clean']
    ],
    handlers: {
      image: function () {
        const quill = this.quill;
        const url = prompt('Pega la URL de la imagen:');
        if (url) {
          const range = quill.getSelection();
          quill.insertEmbed(range ? range.index : 0, 'image', url, 'user');
        }
      }
    }
  },
  'emoji-toolbar': true,
  'emoji-textarea': false,
  'emoji-shortname': true
};

// Formatos permitidos en el editor visual
const quillFormats = [
  'header', 'font', 'size', 'bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block',
  'color', 'background', 'align',
  'list', 'bullet', 'indent',
  'link', 'image', 'video', 'formula', 'emoji'
];

function AdminPanel() {
  // ----------------------------- ESTADOS PRINCIPALES -----------------------------
  // Noticias, formularios, categorías, usuarios, comentarios, feedback, login, editor visual
  // Puedes agregar más estados según tus necesidades de administración
  const [noticias, setNoticias] = useState([]); // Lista de noticias
  const [noticiaEdit, setNoticiaEdit] = useState(null); // ID de noticia en edición
  const [form, setForm] = useState({
    id: '', titulo: '', categoria: '', categoria_id: '', fecha: '', autor_id: '', editor_id: '', imagen: '', likes: 0, vistas: 0, contenido: ''
  });
  const [medias, setMedias] = useState([]); // Medios asociados a la noticia
  const [categorias, setCategorias] = useState([]);
  const [catForm, setCatForm] = useState({ id: '', nombre: '' });
  const [usuarios, setUsuarios] = useState([]);
  const [comentarios, setComentarios] = useState([]);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [logged, setLogged] = useState(false);
  const [nombre, setNombre] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [modoHtml, setModoHtml] = useState(false);

  // Referencia para el editor visual
  const quillRef = React.useRef(null);
  const quillInstanceRef = React.useRef(null); // Guardar instancia real de Quill

  // ----------------------------- CARGA DE DATOS INICIALES -----------------------------
  // Al montar el componente, carga todas las entidades necesarias
  useEffect(() => {
    fetchAll();
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('admin_user');
      if (user) setLogged(true);
    }
  }, []);
  async function fetchAll() {
    await Promise.all([
      fetchNoticias(),
      fetchCategorias(),
      fetchUsuarios(),
      fetchComentarios()
    ]);
  }
  async function fetchNoticias() {
    const { data } = await supabase.from('noticias').select('*, categorias(nombre), usuarios!noticias_autor_id_fkey(nombre)').order('created_at', { ascending: false }).limit(30);
    setNoticias(data || []);
  }
  async function fetchCategorias() {
    const { data } = await supabase.from('categorias').select('*').order('nombre');
    setCategorias(data || []);
  }
  async function fetchUsuarios() {
    const { data } = await supabase.from('usuarios').select('*').order('nombre');
    setUsuarios(data || []);
  }
  async function fetchComentarios() {
    const { data } = await supabase.from('comentarios').select('id, texto, autor, fecha').order('fecha', { ascending: false }).limit(20);
    setComentarios(data || []);
  }
  // --- CRUD Noticias ---
  function limpiarForm() {
    setForm({ id: '', titulo: '', categoria: '', categoria_id: '', fecha: '', autor_id: '', editor_id: '', imagen: '', likes: 0, vistas: 0, contenido: '' });
    setMedias([]);
    setNoticiaEdit(null);
  }
  async function handleEditNoticia(n) {
    setForm({
      id: n.id,
      titulo: n.titulo || '',
      categoria: n.categoria || '',
      categoria_id: n.categoria_id || '',
      fecha: n.fecha || '',
      autor_id: n.autor_id || '',
      editor_id: n.editor_id || '',
      imagen: n.imagen || '',
      likes: n.likes || 0,
      vistas: n.vistas || 0,
      contenido: n.contenido || ''
    });
    // Cargar medias
    const { data } = await supabase.from('noticia_media').select('*').eq('noticia_id', n.id).order('orden');
    setMedias(data || []);
    setNoticiaEdit(n.id);
  }
  async function handleDeleteNoticia(id) {
    if (!confirm('¿Eliminar esta noticia?')) return;
    await supabase.from('noticias').delete().eq('id', id);
    await supabase.from('noticia_media').delete().eq('noticia_id', id);
    setMsg('Noticia eliminada');
    fetchNoticias();
    limpiarForm();
  }
  function handleFormChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }
  // Medias
  function addMediaRow(media = {}) {
    setMedias(m => [...m, { tipo: media.tipo || 'imagen', url: media.url || '', orden: media.orden || 0, descripcion: media.descripcion || '' }]);
  }
  function updateMedia(idx, field, value) {
    setMedias(m => m.map((media, i) => i === idx ? { ...media, [field]: value } : media));
  }
  function removeMedia(idx) {
    setMedias(m => m.filter((_, i) => i !== idx));
  }
  function transformarLink(url, tipo) {
    url = url.trim();
    if (tipo === 'video') {
      const ytShorts = url.match(/youtube\.com\/shorts\/([\w-]+)/);
      const ytNormal = url.match(/youtube\.com\/watch\?v=([\w-]+)/);
      const ytShare = url.match(/youtu\.be\/([\w-]+)/);
      if (ytShorts) return `https://www.youtube.com/embed/${ytShorts[1]}`;
      if (ytNormal) return `https://www.youtube.com/embed/${ytNormal[1]}`;
      if (ytShare) return `https://www.youtube.com/embed/${ytShare[1]}`;
    }
    if (tipo === 'audio') {
      const sc = url.match(/(https:\/\/soundcloud\.com\/[\w\-]+\/[\w\-]+)/);
      if (sc) return sc[1];
    }
    return url;
  }
  // Guardar noticia (crear/editar)
  async function handleSubmit(e) {
    e.preventDefault();
    setMsg(''); setError('');
    let noticia_id = form.id;
    const noticia = {
      titulo: form.titulo.trim(),
      categoria: form.categoria.trim(),
      fecha: form.fecha,
      contenido: form.contenido.trim(),
      imagen: form.imagen.trim(),
      likes: +form.likes,
      vistas: +form.vistas
    };
    if (form.categoria_id) noticia.categoria_id = +form.categoria_id;
    if (form.autor_id) noticia.autor_id = +form.autor_id;
    if (form.editor_id) noticia.editor_id = +form.editor_id;
    if (noticia_id) {
      await supabase.from('noticias').update(noticia).eq('id', noticia_id);
      await supabase.from('noticia_media').delete().eq('noticia_id', noticia_id);
    } else {
      const { data } = await supabase.from('noticias').insert(noticia).select('id').single();
      noticia_id = data?.id;
    }
    // Guardar medias
    if (noticia_id) {
      const mediasToSave = medias.filter(m => m.url).map((m, i) => ({
        noticia_id,
        tipo: m.tipo,
        url: m.url,
        orden: +m.orden || i + 1,
        descripcion: m.descripcion || null
      }));
      if (mediasToSave.length) await supabase.from('noticia_media').insert(mediasToSave);
    }
    setMsg('Noticia guardada');
    fetchNoticias();
    limpiarForm();
  }
  // --- CRUD Categorías ---
  function limpiarCatForm() { setCatForm({ id: '', nombre: '' }); }
  async function handleCatSubmit(e) {
    e.preventDefault();
    if (catForm.id) {
      await supabase.from('categorias').update({ nombre: catForm.nombre }).eq('id', catForm.id);
    } else {
      await supabase.from('categorias').insert({ nombre: catForm.nombre });
    }
    setMsg('Categoría guardada');
    fetchCategorias();
    limpiarCatForm();
  }
  async function handleEditCat(cat) { setCatForm({ id: cat.id, nombre: cat.nombre }); }
  async function handleDeleteCat(id) {
    if (!confirm('¿Eliminar esta categoría?')) return;
    await supabase.from('categorias').delete().eq('id', id);
    setMsg('Categoría eliminada');
    fetchCategorias();
    limpiarCatForm();
  }
  // --- Comentarios ---
  async function handleDeleteComentario(id) {
    if (!confirm('¿Eliminar este comentario?')) return;
    await supabase.from('comentarios').delete().eq('id', id);
    setMsg('Comentario eliminado');
    fetchComentarios();
  }
  // --- Login / Logout ---
  async function handleLogin(e) {
    e.preventDefault();
    setLoginError(null);
    const sha256 = (await import('crypto-js/sha256')).default;
    const hash = sha256(password).toString();
    const { data } = await supabase
      .from('usuarios')
      .select('*')
      .eq('nombre', nombre)
      .eq('password_hash', hash)
      .single();
    if (data) {
      localStorage.setItem('admin_user', JSON.stringify({ id: data.id, nombre: data.nombre }));
      setLogged(true);
    } else {
      setLoginError('Usuario o contraseña incorrectos');
    }
  }
  function handleLogout() {
    localStorage.removeItem('admin_user');
    setLogged(false);
    setNombre('');
    setPassword('');
  }
  // --- Efecto para agregar menú de tamaño y alineación al hacer click en imagen
  useEffect(() => {
    if (!quillInstanceRef.current) return;
    const quill = quillInstanceRef.current;
    function handleImgClick(e) {
      if (e.target && e.target.tagName === 'IMG') {
        e.preventDefault();
        document.querySelectorAll('.znsf-img-menu').forEach(m => m.remove());
        const menu = document.createElement('div');
        menu.className = 'znsf-img-menu';
        menu.style.position = 'fixed';
        menu.style.top = e.clientY + 'px';
        menu.style.left = e.clientX + 'px';
        menu.style.background = '#fff';
        menu.style.border = '1px solid #ccc';
        menu.style.padding = '8px 12px';
        menu.style.zIndex = 9999;
        menu.style.boxShadow = '0 2px 8px #0002';
        menu.style.borderRadius = '7px';
        menu.style.fontSize = '1em';
        menu.innerHTML =
          '<b>Tamaño:</b> ' + [100,75,50,25].map(p=>`<button data-size="${p}" style="margin:2px 4px;">${p}%</button>`).join('') +
          '<br><b>Alinear:</b> ' +
          ['left','center','right'].map(al=>`<button data-align="${al}" style="margin:2px 4px;">${al[0].toUpperCase()+al.slice(1)}</button>`).join('');
        document.body.appendChild(menu);
        function removeMenu() { menu.remove(); document.removeEventListener('mousedown', removeMenu); }
        setTimeout(()=>document.addEventListener('mousedown', removeMenu), 100);
        menu.querySelectorAll('button[data-size]').forEach(btn => {
          btn.onclick = ev => {
            ev.stopPropagation();
            const img = e.target;
            img.style.width = btn.dataset.size + '%';
            const blot = quill.scroll.find(img);
            if (blot) blot.domNode.style.width = btn.dataset.size + '%';
            removeMenu();
          };
        });
        menu.querySelectorAll('button[data-align]').forEach(btn => {
          btn.onclick = ev => {
            ev.stopPropagation();
            const img = e.target;
            img.style.display = '';
            img.style.margin = '';
            img.style.float = '';
            if (btn.dataset.align === 'center') {
              img.style.display = 'block';
              img.style.margin = '0 auto';
              img.style.float = '';
            } else if (btn.dataset.align === 'left') {
              img.style.display = 'inline';
              img.style.float = 'left';
              img.style.margin = '0 1em 1em 0';
            } else if (btn.dataset.align === 'right') {
              img.style.display = 'inline';
              img.style.float = 'right';
              img.style.margin = '0 0 1em 1em';
            }
            const blot = quill.scroll.find(img);
            if (blot) {
              blot.domNode.style.display = img.style.display;
              blot.domNode.style.margin = img.style.margin;
              blot.domNode.style.float = img.style.float;
            }
            removeMenu();
          };
        });
      }
    }
    quill.root.addEventListener('click', handleImgClick);
    return () => quill.root.removeEventListener('click', handleImgClick);
  }, [modoHtml]);
  // --- Render ---
  if (!logged) {
    return (
      <div style={{padding:'2rem',maxWidth:400,margin:'0 auto'}}>
        <h2>Login Admin</h2>
        <form onSubmit={handleLogin}>
          <input value={nombre} onChange={e=>setNombre(e.target.value)} placeholder="Usuario" style={{width:'100%',padding:8,marginBottom:12}} required />
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Contraseña" style={{width:'100%',padding:8,marginBottom:12}} required />
          <button type="submit" style={{width:'100%',padding:10,background:'#d60000',color:'#fff',borderRadius:8}}>Ingresar</button>
          {loginError && <div style={{color:'red',marginTop:10}}>{loginError}</div>}
        </form>
      </div>
    );
  }

  return (
    <div style={{
      padding:'2rem',
      maxWidth:1100,
      margin:'0 auto',
      position:'relative',
      minHeight:'100vh',
      background:'#fafbfc',
      boxSizing:'border-box',
      overflowX:'auto'
    }}>
      <button onClick={handleLogout} style={{position:'absolute',top:20,right:20,background:'#eee',padding:'8px 16px',borderRadius:8}}>Cerrar sesión</button>
      <h2>Panel de Administración</h2>
      {msg && <div style={{color:'green',marginBottom:10}}>{msg}</div>}
      {error && <div style={{color:'red',marginBottom:10}}>{error}</div>}
      <div style={{
        display:'flex',
        flexDirection:'column',
        gap: '32px',
        alignItems:'stretch',
        width:'100%'
      }}>
        {/* Formulario de noticia */}
        <div style={{background:'#fff',width:'100%',padding:24,borderRadius:12,boxShadow:'0 2px 8px #0001',marginBottom:24}}>
          <form onSubmit={handleSubmit}>
            <input type="hidden" value={form.id} />
            <label>Título:<br/>
              <input name="titulo" value={form.titulo} onChange={handleFormChange} required style={{width:'100%',marginBottom:8}} />
            </label><br/>
            <label>Categoría (texto):<br/>
              <input name="categoria" value={form.categoria} onChange={handleFormChange} required style={{width:'100%',marginBottom:8}} />
            </label><br/>
            <label>Categoría (opcional):<br/>
              <select name="categoria_id" value={form.categoria_id} onChange={handleFormChange} style={{width:'100%',marginBottom:8}}>
                <option value="">(Sin categoría FK)</option>
                {categorias.map(cat => <option key={cat.id} value={cat.id}>{cat.nombre}</option>)}
              </select>
            </label><br/>
            <label>Fecha:<br/>
              <input name="fecha" type="date" value={form.fecha} onChange={handleFormChange} required style={{width:'100%',marginBottom:8}} />
            </label><br/>
            <label>Autor (opcional):<br/>
              <select name="autor_id" value={form.autor_id} onChange={handleFormChange} style={{width:'100%',marginBottom:8}}>
                <option value="">(Sin autor FK)</option>
                {usuarios.map(u => <option key={u.id} value={u.id}>{u.nombre}</option>)}
              </select>
            </label><br/>
            <label>Editor (opcional):<br/>
              <select name="editor_id" value={form.editor_id} onChange={handleFormChange} style={{width:'100%',marginBottom:8}}>
                <option value="">(Sin editor)</option>
                {usuarios.map(u => <option key={u.id} value={u.id}>{u.nombre}</option>)}
              </select>
            </label><br/>
            <label>Imagen principal (URL, opcional):<br/>
              <input name="imagen" value={form.imagen} onChange={handleFormChange} style={{width:'100%',marginBottom:8}} />
            </label><br/>
            <label>Likes:<br/>
              <input name="likes" type="number" value={form.likes} onChange={handleFormChange} style={{width:'100%',marginBottom:8}} />
            </label><br/>
            <label>Vistas:<br/>
              <input name="vistas" type="number" value={form.vistas} onChange={handleFormChange} style={{width:'100%',marginBottom:8}} />
            </label><br/>
            <label>Contenido de la noticia:<br/>
            {/* El botón de alternar modo se mueve fuera del label para evitar bugs de foco/click */}
            </label>
            <button type="button" onClick={()=>setModoHtml(m=>!m)} style={{margin:'8px 0'}}>
              {modoHtml ? 'Usar editor visual' : 'Editar HTML manualmente'}
            </button>
            {modoHtml ? (
              <textarea
                value={form.contenido}
                onChange={e => setForm(f => ({ ...f, contenido: e.target.value }))}
                rows={12}
                style={{width:'100%',fontFamily:'monospace',marginBottom:8}}
                placeholder="Pega aquí HTML avanzado si lo deseas (carruseles, galerías, scripts, etc.)"
              />
            ) : (
              <ReactQuill
                ref={quillRef}
                value={form.contenido}
                onChange={val => setForm(f => ({ ...f, contenido: val }))}
                theme="snow"
                style={{height:250,marginBottom:8}}
                modules={quillModules}
                formats={quillFormats}
                onChangeSelection={(_range, _source, quill) => {
                  if (quill) quillInstanceRef.current = quill;
                }}
                onFocus={(_range, _source, quill) => {
                  if (quill) quillInstanceRef.current = quill;
                }}
                onBlur={(_range, _source, quill) => {
                  if (quill) quillInstanceRef.current = quill;
                }}
              />
            )}
            <button type="button" onClick={()=>setShowPreview(p=>!p)} style={{marginBottom:8}}>
              {showPreview ? 'Ocultar vista previa' : 'Ver vista previa'}
            </button>
            {showPreview && (
              <div style={{border:'1px solid #ddd',borderRadius:8,padding:10,marginBottom:8,background:'#fff'}}>
                <div dangerouslySetInnerHTML={{ __html: form.contenido }} />
              </div>
            )}
            <h4>Medias (imágenes, audios, videos)</h4>
            <div>
              {medias.map((m, idx) => (
                <div key={idx} style={{display:'flex',gap:8,marginBottom:6,alignItems:'center'}}>
                  <select value={m.tipo} onChange={e=>updateMedia(idx,'tipo',e.target.value)}>
                    <option value="imagen">Imagen</option>
                    <option value="audio">Audio</option>
                    <option value="video">Video</option>
                  </select>
                  <input value={m.url} onChange={e=>updateMedia(idx,'url',e.target.value)} placeholder="URL" style={{width:120}} />
                  <button type="button" onClick={()=>updateMedia(idx,'url',transformarLink(m.url,m.tipo))}>Transformar Link</button>
                  <input type="number" value={m.orden} onChange={e=>updateMedia(idx,'orden',e.target.value)} placeholder="Orden" style={{width:60}} />
                  <input value={m.descripcion} onChange={e=>updateMedia(idx,'descripcion',e.target.value)} placeholder="Descripción" style={{width:120}} />
                  <button type="button" onClick={()=>removeMedia(idx)}>🗑️</button>
                </div>
              ))}
              <button type="button" onClick={()=>addMediaRow()}>Agregar Media</button>
            </div>
            <br/>
            <button type="submit">Guardar Noticia</button>
            <button type="button" onClick={limpiarForm} style={{marginLeft:8}}>Limpiar</button>
          </form>
        </div>
        {/* Lista de noticias */}
        <div style={{background:'#fff',width:'100%',padding:24,borderRadius:12,boxShadow:'0 2px 8px #0001',marginBottom:24}}>
          <h3>Noticias existentes</h3>
          <div style={{maxHeight:400,overflowY:'auto'}}>
            {noticias.map(n => (
              <div key={n.id} style={{border:'1px solid #eee',borderRadius:8,padding:10,marginBottom:8,background:'#fff'}}>
                <b>{n.titulo}</b> <small>({n.categorias?.nombre || ''})</small><br/>
                <small>{n.fecha} - {n.usuarios?.nombre || ''}</small><br/>
                <div style={{marginTop:4}}>
                  <button onClick={()=>handleEditNoticia(n)}>✏️ Editar</button>
                  <button onClick={()=>handleDeleteNoticia(n.id)} style={{color:'red',marginLeft:8}}>🗑️ Eliminar</button>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Categorías y comentarios */}
        <div style={{background:'#fff',width:'100%',padding:24,borderRadius:12,boxShadow:'0 2px 8px #0001',marginBottom:24}}>
          <h3>Categorías</h3>
          <form onSubmit={handleCatSubmit} style={{marginBottom:10}}>
            <input value={catForm.nombre} onChange={e=>setCatForm(f=>({...f,nombre:e.target.value}))} placeholder="Nueva categoría" required style={{width:'70%'}} />
            <button type="submit" style={{marginLeft:8}}>Guardar</button>
            <button type="button" onClick={limpiarCatForm} style={{marginLeft:8}}>Limpiar</button>
          </form>
          <ul>
            {categorias.map(cat => (
              <li key={cat.id} style={{marginBottom:8}}>
                {cat.nombre} <button onClick={()=>handleEditCat(cat)}>✏️</button> <button onClick={()=>handleDeleteCat(cat.id)} style={{color:'red'}}>🗑️</button>
              </li>
            ))}
          </ul>
          <h3 style={{marginTop:30}}>Comentarios recientes</h3>
          <ul style={{maxHeight:200,overflowY:'auto'}}>
            {comentarios.map(c => (
              <li key={c.id} style={{marginBottom:8}}>
                <b>{c.autor || 'Anónimo'}:</b> {c.texto?.substring(0,60)}... <small>{c.fecha?.substring(0,10)}</small> <button onClick={()=>handleDeleteComentario(c.id)} style={{color:'red'}}>🗑️</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default withAdminAuth(AdminPanel);

// -----------------------------------------------------------------------------
// El resto del archivo ya cuenta con comentarios explicativos en cada bloque de lógica,
// formularios, renderizado y funciones CRUD. Si necesitas comentarios adicionales en
// funciones específicas, indícalo y se agregarán en detalle.
// -----------------------------------------------------------------------------
