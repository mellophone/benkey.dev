import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.fullwidth}>
          <div className={styles.hstack}>
            <Image
              alt="Ben's Face"
              src="/ben-head-outline.png"
              width={200}
              height={200}
              style={{ borderRadius: "100%" }}
            />
            <div className={styles.hammer}>🔨</div>
          </div>
          <div className={styles.hstack}>
            <h1>Ben Key</h1>
          </div>
          <p>
            {`Software developer and problem solver currently based in North 
            Texas. Looking for exciting new opportunities! You can reach me at `}
            <a href="mailto:bkey3125@gmail.com">bkey3125@gmail.com</a>.
          </p>
          <br />
          <p>
            Recreating this site from scratch right now, so it's a
            work-in-progress! Check back for frequent updates. 😁
          </p>
        </div>
      </main>
    </div>
  );
}
