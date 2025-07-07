import Link from 'next/link';export default function Header() {
  return (
    <header style={{
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
      <Link href="/">
        <a><img src="/logo.png" alt="ZNSF Noticias" style={{maxHeight:'80px',marginBottom:'0.5rem',filter:'drop-shadow(0 2px 8px #0008)',cursor:'pointer'}} /></a>
      </Link>
      <h1 style={{margin:0, fontWeight:800, fontSize:'2.2em', letterSpacing:'2px', textShadow:'0 2px 8px #000a'}}>ZNSF Noticias</h1>
      <p style={{margin:0,opacity:0.85, fontWeight:600, fontSize:'1.1em', letterSpacing:'1px'}}>La realidad a un click de distancia</p>
    </header>
  );
}
