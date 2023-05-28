/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import styles from "@/styles/Home.module.css";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { friendStatesHook, ins, spriteName } from "./Types";

const Sprite = (props: {
  xi: number;
  yi: number;
  name: spriteName;
  id: string;
  instruction: friendStatesHook;
  behavior?: () => void;
  link?: string;
  gridPack?: {
    spriteGrid: boolean[][];
    setXY: (x: number, y: number) => void;
    unsetXY: (x: number, y: number) => void;
    getXY: (x: number, y: number) => boolean;
  };
}) => {
  const [instructionsObject, setInstructionsObject] = props.instruction;
  const setInstruction = (input: ins) => {
    instructionsObject[props.name] = input;
    setInstructionsObject(instructionsObject);
  };

  const [tick, setTick] = useState<number>(0);
  const [speed, setSpeed] = useState<number>(100);
  const [f, setF] = useState<number>(0);
  const [x, setX] = useState<number>(props.xi);
  const [y, setY] = useState<number>(props.yi);
  const [offsetY, setOffsetY] = useState<number>(0);
  const [mouseIn, setMouseIn] = useState<boolean>(false);
  const [spriteCols, setSpriteCols] = useState<number>(5);

  /*/ Sprite Draw Function: Updates only when the frame state changes /*/
  const redraw = () => {
    const shadowCanvas = document.getElementById(
      `${props.id}-shadow`
    ) as HTMLCanvasElement;
    const shadowctx = shadowCanvas.getContext("2d");
    if (!shadowctx) {
      return;
    }
    shadowctx.clearRect(0, 0, 100, 100 * (17 / 16));

    const shad = document.getElementById("shadow") as HTMLImageElement;
    const sw = shad.naturalWidth;
    const sh = shad.naturalHeight;
    shadowctx.drawImage(shad, 0, 0, sw, sh, 0, 0, 100, 100 * (17 / 16));
    shad.onload = redraw; // THIS DOESN'T WORK, FIX

    const canvas = document.getElementById(props.id) as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      alert("!ctx");
      return;
    }
    ctx.clearRect(0, 0, 100, 100);

    const image = document.getElementById(props.name) as HTMLImageElement;
    const nw = image.naturalWidth;
    const nh = image.naturalHeight;
    // const cw = nw / 5;
    const cw = 160;
    setSpriteCols(nw / cw);
    const ch = nh / 4;
    ctx.drawImage(
      image,
      cw * (f % spriteCols), // crop distance from left
      cw * Math.floor(f / spriteCols), // crop distance from top
      cw, // width of crop
      ch, // height of crop
      0, // x on canvas to draw
      0, // y on canvas to draw
      100, // width of canvas to draw
      100 // height of canvas to draw
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
    const pixelSize = window.innerWidth / 256;
    const pixelHeight = window.innerHeight / pixelSize - 16;
    return !(
      props.gridPack.getXY(checkX, checkY) ||
      (direction.includes("W") && x <= 0) ||
      (direction.includes("E") && x >= 240) ||
      (direction.includes("N") && y <= 0) ||
      (direction.includes("S") && y >= pixelHeight - (pixelHeight % 5))
    );
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
      const instruction = instructionsObject[props.name];
      if (!instruction || (instruction && instruction.complete)) {
        props.behavior && props.behavior();
      }
    }, 500);
    return () => clearInterval(intervalId);
  });

  /*/ Sprite Animator /*/
  useEffect(() => {
    const intervalId = setInterval(() => {
      const instruction = instructionsObject[props.name];
      if (instruction && !instruction.complete) {
        const { action } = instruction.data;

        if (action === "walk") {
          if (speed !== instruction.data.speed) {
            setSpeed(instruction.data.speed);
          }
          const { direction, times } = instruction.data;
          const newF =
            ((f % spriteCols) % 4) +
            1 +
            spriteCols *
              (direction === "SE"
                ? 0
                : direction === "SW"
                ? 1
                : direction === "NW"
                ? 2
                : 3);
          if (tick === times * 10) {
            instruction.complete = true;
            setF(newF - (newF % spriteCols));
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
                  y >= pixelHeight - (pixelHeight % spriteCols))) &&
              props.behavior &&
              tick === 0
            ) {
              instruction.complete = true;
              return;
            }
            if (tick % 10 == 0) {
              if (!canMove(instruction.data.direction)) {
                instruction.complete = true;
                setF(newF - (newF % spriteCols));
                setTick(0);
                props.gridPack?.setXY(x, y);
                return;
              }
              setMove(instruction.data.direction);
              props.gridPack?.unsetXY(x, y);
            }
            setX(x + (direction.includes("E") ? 1 : -1));
            if ((newF % spriteCols) % 2 === (newF >= spriteCols * 2 ? 0 : 1)) {
              setY(y + (direction.includes("S") ? 1 : -1));
            }
            setF(newF);
            setTick(tick + 1);
          }
        } else if (action === "hop") {
          setF(1);
          if (tick >= 12) {
            setF(0);
          }
          if (tick < 6) {
            setOffsetY(offsetY + 1);
          } else if (tick < 12) {
            setOffsetY(offsetY - 1);
          } else if (!mouseIn) {
            setTick(0);
            instruction.complete = true;
            return;
          }
          setTick(tick + 1);
        } else if (action == "wave") {
          const waves = [5, 6, 7, 8, 9, 8, 9, 8, 7, 6, 5];
          if (tick == waves.length) {
            setTick(0);
            setF(0);
            instruction.complete = true;
            return;
          }
          if (speed !== instruction.data.speed) {
            setSpeed(instruction.data.speed);
          }
          setF(waves[tick]);
          setTick(tick + 1);
        } else if (action == "dance") {
          let poses: number[] = [];
          if (instruction.data.style == "simple") {
            poses = [11, 10, 12, 10];
          } else if (instruction.data.style == "jumpy") {
            poses = [13, 14, 15, 14];
          } else if (instruction.data.style == "army") {
            poses = [
              10, 16, 17, 18, 19, 20, 21, 22, 23, 24, 10, 10, 10, 10, 24, 23,
              22, 21, 20, 19, 18, 17, 16, 10, 10, 10,
            ];
          }
          if (tick % poses.length === 0) {
            if (instruction.data.times && instruction.data.times > 0) {
              instruction.data.times--;
            } else {
              setTick(0);
              setF(0);
              instruction.complete = true;
              return;
            }
          }
          if (speed !== instruction.data.speed) {
            setSpeed(instruction.data.speed);
          }
          setF(poses[tick % poses.length]);
          setTick(tick + 1);
        }
      } else {
        props.gridPack?.setXY(x, y);
      }
    }, speed);
    return () => clearInterval(intervalId);
  });

  const [benType, setBenType] = useState<number>(
    typeof window === "undefined"
      ? 0
      : parseInt(localStorage.getItem("benType") || "0")
  );

  useEffect(() => {
    setBenType(parseInt(localStorage.getItem("benType") || "0"));
  });

  return (
    <a
      href={props.link}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => {
        if (props.name == "ben") {
          const current = parseInt(localStorage.getItem("benType") || "0");
          localStorage.setItem("benType", `${(current + 1) % 3}`);
          console.log(localStorage);
          setBenType((current + 1) % 3);
          redraw();
        }
      }}
      style={{ cursor: "pointer" }}
      onMouseMove={() => {
        if (props.name == "ben") {
          return;
        }
        setSpeed(15);
        const instruction = instructionsObject[props.name];
        if (!instruction || instruction.complete) {
          setInstruction({
            complete: false,
            data: {
              action: "hop",
              speed: 15,
            },
          });
        }
        setMouseIn(true);
      }}
      onMouseEnter={() => {
        if (props.name == "ben") {
          setInstruction({
            complete: false,
            data: {
              action: "wave",
              speed: 60,
            },
          });
          return;
        }
      }}
      onMouseLeave={() => {
        setMouseIn(false);
      }}
    >
      <canvas
        id={`${props.id}-shadow`}
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
      </canvas>
      <canvas
        id={props.id}
        width={100}
        height={100}
        className={styles.canvas}
        style={{
          top: `calc( (100vw / 256)*${y - offsetY})`,
          left: `calc( (100vw / 256)*${x})`,
          width: `calc(100vw / 16)`,
          zIndex: y + 10,
        }}
      >
        <img
          style={{ display: "none" }}
          id={props.name}
          src={`/${props.name == "ben" ? `ben${benType}` : props.name}.png`}
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
  instruction: friendStatesHook;
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
  xyi: [number, number];
  name: spriteName;
  id: string;
  instruction: friendStatesHook;
  link?: string;
  gridPack: {
    spriteGrid: boolean[][];
    setXY: (x: number, y: number) => void;
    unsetXY: (x: number, y: number) => void;
    getXY: (x: number, y: number) => boolean;
  };
}) => {
  const [instructionsObject, setInstructionsObject] = props.instruction;
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
      instructionsObject[props.name] = {
        complete: false,
        data: {
          action: "walk",
          direction,
          speed: 60 + Math.floor(Math.random() * 3) * 20,
          times: Math.floor(Math.random() * 3),
        },
      };
      setInstructionsObject(instructionsObject);
      return;
    }
    const dance = Math.floor(Math.random() * 3) + 1;
    if (dance === 0) {
      const styleNum = Math.floor(Math.random() * 3);
      const styles: ("simple" | "jumpy" | "army")[] = [
        "simple",
        "jumpy",
        "army",
      ];
      const styleSpeeds = [175, 100, 75];
      const style = styles[styleNum];
      const speed = styleSpeeds[styleNum];

      instructionsObject[props.name] = {
        complete: false,
        data: {
          action: "dance",
          style,
          speed,
          times: Math.floor(Math.random() * 2) + 1,
        },
      };
      setInstructionsObject(instructionsObject);
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
