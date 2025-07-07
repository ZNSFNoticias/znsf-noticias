import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import sha256 from 'crypto-js/sha256';

export default function AdminLogin() {
  const [nombre, setNombre] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  async function handleLogin(e) {
    e.preventDefault();
    setError(null);
    const hash = sha256(password).toString();
    const { data } = await supabase
      .from('usuarios')
      .select('*')
      .eq('nombre', nombre)
      .eq('password_hash', hash)
      .single();
    if (data) {
      localStorage.setItem('admin_user', JSON.stringify({ id: data.id, nombre: data.nombre }));
      window.location.href = '/admin';
    } else {
      setError('Usuario o contraseña incorrectos');
    }
  }

  return (
    <div style={{padding:'2rem',maxWidth:400,margin:'0 auto'}}>
      <h2>Login Admin</h2>
      <form onSubmit={handleLogin}>
        <input value={nombre} onChange={e=>setNombre(e.target.value)} placeholder="Usuario" style={{width:'100%',padding:8,marginBottom:12}} required />
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Contraseña" style={{width:'100%',padding:8,marginBottom:12}} required />
        <button type="submit" style={{width:'100%',padding:10,background:'#d60000',color:'#fff',borderRadius:8}}>Ingresar</button>
        {error && <div style={{color:'red',marginTop:10}}>{error}</div>}
      </form>
    </div>
  );
}
