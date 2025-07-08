import withAdminAuth from '../../components/withAdminAuth';
import Link from 'next/link';

function AdminDashboard() {
  return (
    <div style={{padding:'2rem'}}>
      <h1>Panel de Administración</h1>
      <ul style={{fontSize:'1.2em', marginTop:'2rem'}}>
        <li><Link href="/admin/noticias"><a>Gestionar Noticias</a></Link></li>
        <li><Link href="/admin/categorias"><a>Gestionar Categorías</a></Link></li>
        <li><Link href="/admin/comentarios"><a>Gestionar Comentarios</a></Link></li>
        <li><Link href="/admin/panel"><a>panel completo</a></Link></li>
      </ul>
    </div>
  );
}

export default withAdminAuth(AdminDashboard);
