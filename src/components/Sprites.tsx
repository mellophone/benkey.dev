/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import styles from "@/styles/Home.module.css";
import { useEffect, useState } from "react";

const spriteNames = ["ben", "jacketben", "kevin"] as const;
type spriteName = typeof spriteNames[number];

export const Sprite = (props: {
  xi: number;
  yi: number;
  name: spriteName;
  id: string;
}) => {
  const [t, setT] = useState<number>(1);

  const [f, setF] = useState<number>(0);
  const [x, setX] = useState<number>(props.xi);
  const [y, setY] = useState<number>(props.yi);
  const [actionState, setActionState] = useState<string>("");

  useEffect(() => {
    const canvas = document.getElementById(props.id) as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      alert("!ctx");
      return;
    }
    ctx.clearRect(0, 0, 100, 100 * (17 / 16));

    const shad = document.getElementById("shadow") as HTMLImageElement;
    const sw = shad.naturalWidth;
    const sh = shad.naturalHeight;
    ctx.drawImage(shad, 0, 0, sw, sh, 0, 0, 100, 100 * (17 / 16));

    const image = document.getElementById(props.name) as HTMLImageElement;
    const nw = image.naturalWidth;
    const nh = image.naturalHeight;
    const cw = nw / 5;
    const ch = nh / 4;
    ctx.drawImage(
      image,
      cw * (f % 5),
      cw * Math.floor(f / 5),
      cw,
      ch,
      0,
      0,
      100,
      100
    );
  }, [f]);

  setTimeout(() => {
    if (x >= 20) {
      setF(f - (f % 5));
      return;
    }
    setX(x + 1);
    if (f % 2 === 0) {
      setY(y + 1);
    }
    setF((f % 4) + 1);
    setT(t * 1.175);
  }, 30 + t);

  return (
    <canvas
      id={props.id}
      width={100}
      height={100 * (17 / 16)}
      className={styles.canvas}
      style={{
        top: `calc( (100vw / 256)*${y})`,
        left: `calc( (100vw / 256)*${x})`,
        width: `calc(100vw / 16)`,
      }}
    >
      <img
        style={{ display: "none" }}
        id="shadow"
        src={`/shadow.png`}
        alt="shadow"
      />
      <img
        style={{ display: "none" }}
        id={props.name}
        src={`/${props.name}.png`}
        alt={props.name}
      />
    </canvas>
  );
};
