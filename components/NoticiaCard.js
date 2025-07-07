export default function NoticiaCard({ noticia }) {
  return (
    <article style={{display:'flex',alignItems:'flex-start',marginBottom:'1.5rem',borderBottom:'1px solid #eee',paddingBottom:'1rem'}}>
      <img src={noticia.imagen} alt={noticia.titulo} style={{width:'120px',height:'80px',objectFit:'cover',marginRight:'1rem',borderRadius:'4px',border:'1px solid #eee'}} />
      <div style={{flex:1}}>
        <span style={{color:'#666',fontSize:'0.95em'}}>{noticia.fecha}</span> | <span style={{color:'#d60000',fontWeight:'bold',fontSize:'0.95em'}}>{noticia.categoria}</span>
        <h3 style={{margin:'4px 0 6px 0',fontSize:'1.2em'}}>{noticia.titulo}</h3>
        <p style={{margin:'0 0 8px 0',color:'#222'}}>{noticia.resumen}</p>
        <a href="#" style={{color:'#d60000',marginRight:'12px',textDecoration:'none',fontSize:'1em'}}>👍 12</a>
        <a href="#" style={{color:'#d60000',textDecoration:'none',fontSize:'1em'}}>💬 3</a>
      </div>
    </article>
  );
}
