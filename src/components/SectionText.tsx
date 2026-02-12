const SectionText = ({ children }: { children?: any }) => {
  return (
    <div
      style={{
        fontSize: 22,
        fontWeight: 300,
      }}
    >
      {children}
    </div>
  );
};

export default SectionText;
