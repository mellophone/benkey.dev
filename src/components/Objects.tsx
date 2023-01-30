/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";

export const Fountain = (props: { xi: number; yi: number }) => {
  const [x, setX] = useState<number>(props.xi);
  const [y, setY] = useState<number>(props.yi);

  const redraw = () => {
    const canvas = document.getElementById("fountain1") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      alert("!ctx");
      return;
    }
    ctx.clearRect(0, 0, 1000, 1000);
    const fountain = document.getElementById("fountain") as HTMLImageElement;
    ctx.drawImage(
      fountain,
      0,
      0,
      fountain.naturalWidth,
      fountain.naturalHeight,
      0,
      0,
      820,
      540
    );
    fountain.onload = redraw;
  };

  useEffect(() => {
    redraw();
  });

  return (
    <canvas
      id="fountain1"
      width={820}
      height={540}
      style={{
        position: "absolute",
        top: `calc( (100vw / 256)*${y})`,
        left: `calc( (100vw / 256)*${x})`,
        width: `calc((100vw / 256) * ${82})`,
        zIndex: y + 20,
      }}
    >
      <img
        style={{ display: "none" }}
        src={"/fountain.png"}
        alt="fountain"
        id="fountain"
      />
    </canvas>
  );
};
