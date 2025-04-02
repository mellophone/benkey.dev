import NotebookPage from "../components/NotebookPage";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.webpage}>
      <main className={styles.main}>
        <NotebookPage />
        <NotebookPage />
      </main>
    </div>
  );
}
