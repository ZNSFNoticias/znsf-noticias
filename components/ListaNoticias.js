import NoticiaCard from './NoticiaCard';

const noticias = [
  {
    id: 1,
    titulo: 'Nueva ordenanza para comercios locales',
    fecha: '07/07/2025',
    categoria: 'Política',
    resumen: 'El Concejo Deliberante aprobó una nueva normativa que impactará en los pequeños comerciantes de la zona norte...',
    imagen: '/logo.png',
  },
  {
    id: 2,
    titulo: 'Jornada solidaria en el barrio San Jorge',
    fecha: '06/07/2025',
    categoria: 'Sociedad',
    resumen: 'Más de 200 voluntarios participaron en la colecta de alimentos y ropa para familias en situación vulnerable...',
    imagen: '/logo.png',
  },
  {
    id: 3,
    titulo: 'San Fernando FC gana el clásico',
    fecha: '05/07/2025',
    categoria: 'Deportes',
    resumen: 'El equipo local se impuso 2-1 en un partido vibrante ante su histórico rival...',
    imagen: '/logo.png',
  },
];

export default function ListaNoticias() {
  return (
    <div>
      {noticias.map(noticia => (
        <NoticiaCard key={noticia.id} noticia={noticia} />
      ))}
    </div>
  );
}
