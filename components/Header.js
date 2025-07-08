// -----------------------------------------------------------------------------
// COMPONENTE: Header.js
// -----------------------------------------------------------------------------
// Encabezado principal del sitio ZNSF Noticias.
// Muestra el logo, el título y el subtítulo centrados.
//
// Personalización:
// - Cambia el logo reemplazando /logo.png.
// - Modifica colores y estilos en el objeto style del <header>.
// - Edita el título y subtítulo directamente en el JSX.
// - Puedes agregar enlaces, botones o menú de navegación aquí si lo deseas.
//
// Referencias:
// - Para cambiar el color principal, edita 'background' y 'color'.
// - Para modificar la sombra, ajusta 'boxShadow'.
// - Para responsividad, revisa 'fontSize' y 'maxWidth'.
// -----------------------------------------------------------------------------

import Link from 'next/link';

export default function Header() {
  return (
    <header style={{
      // Fondo rojo con transparencia y sombra
      background: 'rgba(214,0,0,0.85)', // Cambia aquí el color principal
      color: '#fff', // Color del texto
      padding: '2.2rem 0 1.2rem 0', // Espaciado superior/inferior
      textAlign: 'center',
      boxShadow: '0 4px 24px #d6000033', // Sombra inferior
      backdropFilter: 'blur(4px)', // Efecto de desenfoque
      borderBottomLeftRadius: '0.7em',
      borderBottomRightRadius: '0.7em',
      position: 'relative',
      zIndex: 10
    }}>
      {/* Contenedor flex para centrar logo y textos verticalmente */}
      <div style={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', width:'100%'}}>
        {/* Logo clickeable que lleva al inicio */}
        {/*
          Personaliza el logo cambiando el archivo /public/logo.png.
          Puedes ajustar el tamaño máximo con 'maxHeight'.
        */}
        <Link href="/">
          <a style={{display:'block'}}>
            <img src="/logo.png" alt="ZNSF Noticias" style={{maxHeight:'80px',marginBottom:'0.7rem',filter:'drop-shadow(0 2px 8px #0008)',cursor:'pointer', marginLeft:'auto', marginRight:'auto', display:'block'}} />
          </a>
        </Link>
        {/* Título principal del sitio */}
        {/*
          Cambia el texto del título aquí.
          Puedes modificar el tamaño y peso en 'fontSize' y 'fontWeight'.
        */}
        <h1 style={{
          margin:0,
          fontWeight:800,
          fontSize:'clamp(1.2em, 4vw, 2.2em)', // Tamaño responsivo
          letterSpacing:'1.5px',
          textShadow:'0 2px 8px #000a',
          maxWidth:'95vw',
          lineHeight:1.1,
          wordBreak:'break-word',
          marginLeft:'auto',
          marginRight:'auto',
          padding:'0 1vw',
          whiteSpace:'pre-line',
          display:'block'
        }}>
          Zona Norte San Fernando Noticias
        </h1>
        {/* Subtítulo */}
        {/*
          Edita el subtítulo aquí.
          Puedes cambiar el tamaño, opacidad y peso en el objeto style.
        */}
        <p style={{margin:0,opacity:0.85, fontWeight:600, fontSize:'1.1em', letterSpacing:'1px'}}>La realidad a un click de distancia</p>
      </div>
    </header>
  );
}
