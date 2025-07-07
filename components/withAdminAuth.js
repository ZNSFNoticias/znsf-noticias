import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function withAdminAuth(Component) {
  return function AuthWrapper(props) {
    const router = useRouter();
    useEffect(() => {
      if (typeof window !== 'undefined') {
        const user = localStorage.getItem('admin_user');
        if (!user) {
          router.replace('/admin/login');
        }
      }
    }, []);
    return <Component {...props} />;
  };
}
