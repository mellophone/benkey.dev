import { JSX } from "react";

const Col = ({ children }: { children?: any }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>{children}</div>
  );
};

export default Col;
