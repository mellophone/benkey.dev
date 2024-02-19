/* eslint-disable react-hooks/exhaustive-deps */
import WorldManager from "@/handlers/WorldManager";
import { MapObject } from "@/types/MapObject";
import { useEffect, useState } from "react";

const CANVAS_ID = "canvas-area";

export const MapCanvas = (props: { mapObject: MapObject }) => {
  const { mapObject } = props;
  const [worldManager] = useState<WorldManager>(new WorldManager(mapObject));

  useEffect(() => onStartup(), []);

  const onStartup = () => {
    const canvas = getCanvas();
    worldManager.onStartup(canvas);
  };

  const getCanvas = (): HTMLCanvasElement => {
    const canvas = document.getElementById(CANVAS_ID);
    if (!canvas)
      throw new Error(`Cannot find canvas element with id: ${CANVAS_ID}`);
    return canvas as HTMLCanvasElement;
  };

  return (
    <canvas
      tabIndex={1}
      id={CANVAS_ID}
      style={{
        backgroundColor: "black",
        imageRendering: "pixelated",
        position: "fixed",
        outline: "none",
      }}
      onMouseMove={(ev) => {}}
      onMouseLeave={() => {}}
      onClick={() => {}}
    ></canvas>
  );
};
