/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import styles from "@/styles/Home.module.css";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ins } from "./Types";

const spriteNames = [
  "ben",
  "jacketben",
  "kevin",
  "mihir",
  "gen",
  "frank",
  "alizain",
  "johnny",
  "nathan",
] as const;
type spriteName = typeof spriteNames[number];

const Sprite = (props: {
  xi: number;
  yi: number;
  name: spriteName;
  id: string;
  instruction: [ins | undefined, Dispatch<SetStateAction<ins | undefined>>];
  behavior?: () => void;
  link?: string;
  gridPack?: {
    spriteGrid: boolean[][];
    setXY: (x: number, y: number) => void;
    unsetXY: (x: number, y: number) => void;
    getXY: (x: number, y: number) => boolean;
  };
}) => {
  const [instruction, setInstruction] = props.instruction;
  const [tick, setTick] = useState<number>(0);
  const [speed, setSpeed] = useState<number>(100);
  const [f, setF] = useState<number>(0);
  const [x, setX] = useState<number>(props.xi);
  const [y, setY] = useState<number>(props.yi);

  /*/ Sprite Draw Function: Updates only when the frame state changes /*/
  const redraw = () => {
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
    shad.onload = redraw;

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
    image.onload = redraw;
  };

  useEffect(() => {
    redraw();
    setTimeout(() => {
      redraw();
    }, 10);
  }, []);

  useEffect(() => {
    redraw();
  }, [f]);

  const canMove = (direction: "SE" | "SW" | "NW" | "NE"): boolean => {
    if (!props.gridPack) return true;
    const checkX = x + (direction.includes("E") ? 10 : -10);
    const checkY = y + (direction.includes("S") ? 5 : -5);
    return !props.gridPack.getXY(checkX, checkY);
  };

  const setMove = (direction: "SE" | "SW" | "NW" | "NE"): void => {
    if (!props.gridPack) return;
    const checkX = x + (direction.includes("E") ? 10 : -10);
    const checkY = y + (direction.includes("S") ? 5 : -5);
    props.gridPack.setXY(checkX, checkY);
  };

  /*/ Sprite Thinker /*/
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!instruction || (instruction && instruction.complete)) {
        props.behavior && props.behavior();
      }
    }, 500);
    return () => clearInterval(intervalId);
  });

  /*/ Sprite Animator /*/
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (instruction && !instruction.complete) {
        const { action } = instruction.data;

        if (action === "walk") {
          if (speed !== instruction.data.speed) {
            setSpeed(instruction.data.speed);
          }
          const { direction, times } = instruction.data;
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
          if (tick === times * 10) {
            instruction.complete = true;
            setF(newF - (newF % 5));
            setTick(0);
            return;
          } else {
            const pixelSize = window.innerWidth / 256;
            const pixelHeight = window.innerHeight / pixelSize - 16;
            if (
              ((instruction.data.direction.includes("W") && x <= 0) ||
                (instruction.data.direction.includes("E") && x >= 240) ||
                (instruction.data.direction.includes("N") && y <= 0) ||
                (instruction.data.direction.includes("S") &&
                  y >= pixelHeight - (pixelHeight % 5))) &&
              props.behavior &&
              tick === 0
            ) {
              instruction.complete = true;
              return;
            }
            if (tick % 10 == 0) {
              if (!canMove(instruction.data.direction)) {
                instruction.complete = true;
                setF(newF - (newF % 5));
                setTick(0);
                props.gridPack?.setXY(x, y);
                return;
              }
              setMove(instruction.data.direction);
              props.gridPack?.unsetXY(x, y);
            }
            setX(x + (direction.includes("E") ? 1 : -1));
            if ((newF % 5) % 2 === (newF > 9 ? 0 : 1)) {
              setY(y + (direction.includes("S") ? 1 : -1));
            }
            setF(newF);
            setTick(tick + 1);
          }
        }
      }
    }, speed);
    return () => clearInterval(intervalId);
  });

  return (
    <a href={props.link} target="_blank" rel="noopener noreferrer">
      <canvas
        id={props.id}
        width={100}
        height={100 * (17 / 16)}
        className={styles.canvas}
        style={{
          top: `calc( (100vw / 256)*${y})`,
          left: `calc( (100vw / 256)*${x})`,
          width: `calc(100vw / 16)`,
          zIndex: y + 10,
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
    </a>
  );
};

export const BenSprite = (props: {
  xi: number;
  yi: number;
  name: spriteName;
  id: string;
  instruction: [ins | undefined, Dispatch<SetStateAction<ins | undefined>>];
}) => {
  return (
    <Sprite
      id={props.id}
      instruction={props.instruction}
      name={props.name}
      xi={props.xi}
      yi={props.yi}
    />
  );
};

export const FriendSprite = (props: {
  // xi: number;
  // yi: number;
  xyi: [number, number];
  name: spriteName;
  id: string;
  instruction: [ins | undefined, Dispatch<SetStateAction<ins | undefined>>];
  link?: string;
  gridPack: {
    spriteGrid: boolean[][];
    setXY: (x: number, y: number) => void;
    unsetXY: (x: number, y: number) => void;
    getXY: (x: number, y: number) => boolean;
  };
}) => {
  const [instruction, setInstruction] = props.instruction;
  const randomBehavior = () => {
    const move = Math.floor(Math.random() * 3);
    if (move === 0) {
      const randomDirection = Math.floor(Math.random() * 4);
      const direction =
        randomDirection === 0
          ? "SE"
          : randomDirection === 1
          ? "SW"
          : randomDirection === 2
          ? "NE"
          : "NW";
      setInstruction({
        complete: false,
        data: {
          action: "walk",
          direction,
          speed: 80,
          times: Math.floor(Math.random() * 2),
        },
      });
    }
  };
  return (
    <Sprite
      id={props.id}
      instruction={props.instruction}
      name={props.name}
      xi={props.xyi[0]}
      yi={props.xyi[1]}
      link={props.link}
      behavior={randomBehavior}
      gridPack={props.gridPack}
    />
  );
};
