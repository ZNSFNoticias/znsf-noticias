export default function Sidebar() {
  return (
    <aside style={{background:'#f5f5f5',padding:'1rem',minWidth:'220px',marginRight:'2rem'}}>
      <h2>Redes Sociales</h2>
      <ul style={{listStyle:'none',padding:0}}>
        <li><a href="https://www.instagram.com/znsfnoticias/" target="_blank" rel="noopener noreferrer">Instagram</a></li>
        <li><a href="https://x.com/znsfnoticias" target="_blank" rel="noopener noreferrer">Twitter (X)</a></li>
        <li><a href="https://www.youtube.com/@ZNSFNoticias" target="_blank" rel="noopener noreferrer">YouTube</a></li>
        <li><a href="https://www.tiktok.com/@znsfnoticias" target="_blank" rel="noopener noreferrer">TikTok</a></li>
      </ul>
      <h2>Noticias más vistas</h2>
      <ul style={{listStyle:'none',padding:0}}>
        <li><a href="#">Vecinos reclaman mejoras en el transporte</a></li>
        <li><a href="#">San Fernando campeón en fútbol local</a></li>
        <li><a href="#">Entrevista exclusiva con la intendenta</a></li>
      </ul>
    </aside>
  );
}
