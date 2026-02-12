import { JSX } from "react";

const Row = ({
  gap = 0,
  wrapReverse,
  children,
}: {
  gap?: number;
  wrapReverse?: boolean;
  children?: any;
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        width: "100%",
        gap: gap,
        flexWrap: wrapReverse ? "wrap-reverse" : "wrap",
      }}
    >
      {children}
    </div>
  );
};

export default Row;
