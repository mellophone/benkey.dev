import Head from "next/head";
import WorldManager from "./WorldManager";
import MapObject from "@/types/MapObject";
import { useCallback, useEffect } from "react";

const CANVAS_ID = "canvas-area";

const KeyBitCanvas = (props: { mapObject: MapObject }) => {
  const { mapObject } = props;

  const getCanvas = useCallback((): HTMLCanvasElement => {
    const canvas = document.getElementById(CANVAS_ID);
    if (!canvas)
      throw new Error(`Cannot find canvas element with id: ${CANVAS_ID}`);
    return canvas as HTMLCanvasElement;
  }, []);

  const onStartup = useCallback(() => {
    const canvas = getCanvas();
    const worldManager = new WorldManager(canvas, mapObject);
  }, [getCanvas, mapObject]);

  useEffect(onStartup, [onStartup]);

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
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="theme-color" content="#000000" />

        <meta property="og:image" content="/preview.png" />
        <meta property="og:url" content="/" />
        <meta property="og:title" content="KeyBit" />
        <meta property="og:type" content="website" />
        <meta name="robots" content="index, max-image-preview:large" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="KeyBit" />
        <meta name="twitter:image" content="/preview.png" />
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
      ></canvas>
    </>
  );
};

export default KeyBitCanvas;
