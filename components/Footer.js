/*
  Footer.js
  ---------
  Componente de pie de página para mostrar información de copyright y contacto.
  Modifica los estilos inline o el contenido del <p> para personalizar el footer.
*/

export default function Footer() {
  return (
    // Pie de página fijo al final. Cambia background, color, padding, etc. para personalizar.
    <footer style={{
      background: 'rgba(34,34,34,0.92)', // Fondo oscuro con transparencia
      color: '#fff', // Color del texto
      padding: '1.2rem',
      textAlign: 'center',
      marginTop: '2rem',
      borderTopLeftRadius: '0.7em',
      borderTopRightRadius: '0.7em',
      fontWeight: 600,
      fontSize: '1.05em',
      letterSpacing: '1px',
      boxShadow: '0 -2px 12px #0006',
      backdropFilter: 'blur(4px)'
    }}>
      {/* Puedes cambiar el texto de copyright y el mail de contacto aquí */}
      <p>© 2025 ZNSF Noticias | Contacto: znsfnoticias@gmail.com</p>
    </footer>
  );
}
