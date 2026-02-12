const SectionCol = ({ children }: { children?: any }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flex: "1 1 300px",
        minWidth: "300px",
      }}
    >
      {children}
    </div>
  );
};

export default SectionCol;
