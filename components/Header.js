// Header principal del sitio. Muestra el logo, el título y el subtítulo centrados.
import Link from 'next/link';
export default function Header() {
  return (
    <header style={{
      // Fondo rojo con transparencia y sombra
      background: 'rgba(214,0,0,0.85)',
      color: '#fff',
      padding: '2.2rem 0 1.2rem 0',
      textAlign: 'center',
      boxShadow: '0 4px 24px #d6000033',
      backdropFilter: 'blur(4px)',
      borderBottomLeftRadius: '0.7em',
      borderBottomRightRadius: '0.7em',
      position: 'relative',
      zIndex: 10
    }}>
      {/* Contenedor flex para centrar logo y textos verticalmente */}
      <div style={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', width:'100%'}}>
        {/* Logo clickeable que lleva al inicio */}
        <Link href="/">
          <a style={{display:'block'}}>
            <img src="/logo.png" alt="ZNSF Noticias" style={{maxHeight:'80px',marginBottom:'0.7rem',filter:'drop-shadow(0 2px 8px #0008)',cursor:'pointer', marginLeft:'auto', marginRight:'auto', display:'block'}} />
          </a>
        </Link>
        {/* Título principal del sitio */}
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
        <p style={{margin:0,opacity:0.85, fontWeight:600, fontSize:'1.1em', letterSpacing:'1px'}}>La realidad a un click de distancia</p>
      </div>
    </header>
  );
}
