/*
  index.js (Home)
  ---------------
  Página principal del sitio. Muestra el header, slider, sidebar, lista de noticias y footer.
  Modifica este archivo para cambiar la estructura general de la portada, el orden de los bloques, o agregar nuevas secciones.
  Los estilos principales están en Home.module.css.
*/

import Header from '../components/Header';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import ListaNoticias from '../components/ListaNoticias';
import NoticiasSlider from '../components/NoticiasSlider';
import ComentariosRecientes from '../components/ComentariosRecientes';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    // Contenedor principal de la portada
    <div className={styles.container}>
      <Header />
      {/* Main layout: sidebar a la izquierda, slider y noticias a la derecha */}
      <main className={styles.mainContent}>
        <div className={styles.leftCol}>
          <Sidebar />
          <ComentariosRecientes />
        </div>
        <div className={styles.rightCol}>
          {/* Slider de noticias destacadas */}
          <section className={styles.sliderSection}>
            <NoticiasSlider />
          </section>
          {/* Lista de últimas noticias */}
          <section className={styles.newsSection}>
            <h2>Últimas Noticias</h2>
            <ListaNoticias />
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
