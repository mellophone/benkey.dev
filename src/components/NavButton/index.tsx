import styles from "./index.module.css";

const NavButton = ({ href, children }: { href?: string; children?: any }) => {
  return (
    <a href={href} className={styles.button}>
      <div className={styles.content}>{children}</div>
    </a>
  );
};

export default NavButton;
