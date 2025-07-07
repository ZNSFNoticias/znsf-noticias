import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from '../styles/Home.module.css';

export default function Noticia() {
  // Aquí iría la lógica para obtener la noticia por ID
  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.mainContent}>
        <article className={styles.article}>
          <h1>Título de la Noticia</h1>
          <p className={styles.meta}>07/07/2025 | Política</p>
          <img src="/logo.png" alt="Imagen noticia" className={styles.imgNoticia} />
          <p>Contenido completo de la noticia...</p>
        </article>
      </main>
      <Footer />
    </div>
  );
}
