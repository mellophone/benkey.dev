/* eslint-disable react-hooks/exhaustive-deps */
import WorldManager from "@/handlers/WorldManager";
import Head from "next/head";
import { MapObject } from "@/types/MapObject";
import { useEffect, useState } from "react";

const CANVAS_ID = "canvas-area";

export const MapCanvas = (props: { mapObject: MapObject }) => {
  const { mapObject } = props;
  const [, setWorldManager] = useState<WorldManager | undefined>();

  useEffect(() => onStartup(), []);

  const onStartup = () => {
    const canvas = getCanvas();
    const newWorldManager = new WorldManager(canvas, mapObject);
    setWorldManager(newWorldManager);
  };

  const getCanvas = (): HTMLCanvasElement => {
    const canvas = document.getElementById(CANVAS_ID);
    if (!canvas)
      throw new Error(`Cannot find canvas element with id: ${CANVAS_ID}`);
    return canvas as HTMLCanvasElement;
  };

  return (
    <>
      <Head>
        <title>KeyBit</title>
        <link rel="icon" type="image/x-icon" href="/benicon.png" />
        <link rel="apple-touch-icon" href="/benicon.png" />
        <meta
          name="viewport"
          content="width=device-width, height=device-height, initial-scale=1.0, viewport-fit=cover"
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="theme-color" content="#000000" />
      </Head>
      <canvas
        tabIndex={1}
        id={CANVAS_ID}
        style={{
          backgroundColor: "black",
          imageRendering: "pixelated",
          position: "fixed",
          outline: "none",
          zoom: 1,
          touchAction: "none",
        }}
        onMouseMove={(ev) => {}}
        onMouseLeave={() => {}}
        onClick={() => {}}
      ></canvas>
    </>
  );
};
