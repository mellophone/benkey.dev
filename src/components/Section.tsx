const Section = ({
  id,
  secondary,
  children,
}: {
  id?: string;
  secondary?: boolean;
  children?: any;
}) => {
  return (
    <div
      id={id}
      style={{
        backgroundColor: secondary ? "var(--mid-green)" : "var(--background)",
        width: "100%",
        color: secondary ? "#fefae0" : "var(--foreground)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 40,
        fontSize: 16,
        fontWeight: 300,
      }}
    >
      <div style={{ width: "100%", maxWidth: 1000 }}>{children}</div>
    </div>
  );
};

export default Section;
