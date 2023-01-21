import styles from "@/styles/Home.module.css";
export const Card = (props: { children?: any }) => {
  return <div className={styles.card}>{props.children}</div>;
};

export const Row = (props: { children?: any }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {props.children}
    </div>
  );
};

export const Column = (props: { children?: any }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {props.children}
    </div>
  );
};
