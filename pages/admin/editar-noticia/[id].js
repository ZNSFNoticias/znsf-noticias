import NoticiaEditor from '../../../components/NoticiaEditor';
import { useRouter } from 'next/router';

export default function EditarNoticia() {
  const router = useRouter();
  const { id } = router.query;
  return <NoticiaEditor noticiaId={id} />;
}
