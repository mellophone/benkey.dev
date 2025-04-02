import styles from "../app/page.module.css";

const NotebookPage = () => {
  return (
    <div className={styles.page}>
      <picture>
        <source
          className={styles.paper}
          media="(max-width:600px)"
          srcSet="/notebook-paper-wide.svg"
        />
        <img
          className={styles.paper}
          src="/notebook-paper.svg"
          alt="Notebook Paper"
        />
      </picture>
      <p className={styles.pagetext}>
        &emsp;My name is Ben Key. This is my website. Thanks for stopping by!
        This is my website. Thanks for stopping by!
        <br />
        <br />
        &emsp;Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
        eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
        minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
        ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
        voluptate velit esse cillum dolore eu fugiat nulla pariatur.
      </p>
    </div>
  );
};

export default NotebookPage;
