import Header from '../components/Header';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import ListaNoticias from '../components/ListaNoticias';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.mainContent}>
        <Sidebar />
        <section className={styles.newsSection}>
          <h2>Últimas Noticias</h2>
          <ListaNoticias />
        </section>
      </main>
      <Footer />
    </div>
  );
}
