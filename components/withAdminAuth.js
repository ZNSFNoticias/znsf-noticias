/*
  withAdminAuth.js
  ---------------
  High Order Component (HOC) para proteger rutas de administración.
  Redirige a /admin/login si no hay usuario admin logueado en localStorage.
  Usa este HOC para envolver cualquier página o componente que requiera autenticación de admin.
*/

import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function withAdminAuth(Component) {
  // Devuelve un componente que verifica autenticación antes de renderizar
  return function AuthWrapper(props) {
    const router = useRouter();
    useEffect(() => {
      if (typeof window !== 'undefined') {
        const user = localStorage.getItem('admin_user');
        if (!user) {
          // Si no hay usuario admin, redirige al login
          router.replace('/admin/login');
        }
      }
    }, []);
    // Si está autenticado, renderiza el componente original
    return <Component {...props} />;
  };
}
