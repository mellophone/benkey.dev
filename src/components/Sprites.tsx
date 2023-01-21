/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import styles from "@/styles/Home.module.css";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ins } from "./Types";

const spriteNames = ["ben", "jacketben", "kevin"] as const;
type spriteName = typeof spriteNames[number];

export const Sprite = (props: {
  xi: number;
  yi: number;
  name: spriteName;
  id: string;
  instruction: [ins | undefined, Dispatch<SetStateAction<ins | undefined>>];
}) => {
  const [instruction, setInstruction] = props.instruction;
  const [tick, setTick] = useState<number>(0);

  const [speed, setSpeed] = useState<number>(100);
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
    if (instruction && !instruction.complete) {
      if (instruction.data.action === "walk") {
        setSpeed(instruction.data.speed);
      }
    }
  }, 0);

  setTimeout(() => {
    if (instruction && !instruction.complete) {
      const { action } = instruction.data;

      if (action === "walk") {
        const { direction, times } = instruction.data;

        if (tick === times * 10) {
          instruction.complete = true;
          setF(f - (f % 5));
          setTick(0);
        } else {
          const newF =
            ((f % 5) % 4) +
            1 +
            5 *
              (direction === "SE"
                ? 0
                : direction === "SW"
                ? 1
                : direction === "NW"
                ? 2
                : 3);
          setX(x + (direction.includes("E") ? 1 : -1));
          if ((newF % 5) % 2 === (newF > 9 ? 0 : 1)) {
            setY(y + (direction.includes("S") ? 1 : -1));
          }
          setF(newF);
          setTick(tick + 1);
          // console.log(`${instruction.data.times} ${f} ${tick}`);
        }
      }
    }
  }, speed);

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
