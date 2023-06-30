/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import { DefaultHead } from "@/components/DefaultHead";
import { useEffect, useState } from "react";
import textures from "../components/textures.json";
import { isoToSnapPos } from "@/components/gridConversions";
import { CELL_WIDTH } from "./mapmaker";

export default function Home() {
  const [camX, setCamX] = useState(0);
  const [camY, setCamY] = useState(0);
  const [zoom, setZoom] = useState(8);

  useEffect(() => {
    const mX = camX + innerWidth / 2 / zoom;
    const mY = camY + innerHeight / 2 / zoom;
    const map = document.getElementById("housemap") as HTMLImageElement;
    const handleKeyDown = (ev: KeyboardEvent) => {
      switch (ev.key.toLowerCase()) {
        case "w":
          setCamY(camY - 10);
          break;
        case "a":
          setCamX(camX - 20);
          break;
        case "s":
          setCamY(camY + 10);
          break;
        case "d":
          setCamX(camX + 20);
          break;
      }
    };

    const handleCameraEdges = () => {
      const zoomCorrect = Math.max(
        Math.ceil((100 * innerWidth) / map.naturalWidth) / 100,
        Math.ceil((100 * innerHeight) / map.naturalHeight) / 100,
        8
      );
      if (zoom !== zoomCorrect) return setZoom(zoomCorrect);

      if (camX < 0) setCamX(0);
      else if (camX > map.naturalWidth - innerWidth / zoom)
        setCamX(map.naturalWidth - innerWidth / zoom);
      else setCamX(mX - innerWidth / 2 / zoom);
      if (camY < 0) setCamY(0);
      else if (camY > map.naturalHeight - innerHeight / zoom)
        setCamY(map.naturalHeight - innerHeight / zoom);
      else setCamY(mY - innerHeight / 2 / zoom);
    };

    handleCameraEdges();

    document.getElementsByTagName("body")[0].onkeydown = handleKeyDown;

    window.onresize = handleCameraEdges;
  }, [camX, camY, zoom]);

  useEffect(() => {
    const worldLoop = setInterval(() => {
      const canvas = document.getElementById(
        "canvas-area"
      ) as HTMLCanvasElement;
      const context = canvas.getContext("2d") as CanvasRenderingContext2D;
      const map = document.getElementById("housemap") as HTMLImageElement;
      canvas.height = map.naturalHeight;
      canvas.width = map.naturalWidth;
      context.clearRect(0, 0, 1920, 1080);
      context.drawImage(map, Math.ceil(-camX), Math.ceil(-camY));

      type RenderObject = {
        x: number;
        y: number;
        img: HTMLImageElement;
        pxOff: number;
        pyOff: number;
        priority?: number;
      };

      const itemsToRender: RenderObject[] = [];

      for (let i = 0; i < textures.textures.length; i++) {
        const t = textures.textures[i];
        const img = document.getElementById(t.src) as HTMLImageElement;
        const { pxOff, pyOff } = t;
        t.renderCells.forEach((rc) => {
          const [x, y] = isoToSnapPos(...(rc as [number, number]));
          const renderObj: RenderObject = {
            x,
            y,
            img,
            pxOff,
            pyOff,
            priority: i,
          };
          itemsToRender.push(renderObj);
        });
      }

      itemsToRender.sort((a, b) => (a.y > b.y ? 1 : a.y < b.y ? -1 : 0));

      itemsToRender.forEach((item) =>
        context.drawImage(
          item.img,
          item.x - item.pxOff,
          0,
          CELL_WIDTH,
          item.img.naturalHeight,
          item.x + Math.ceil(-camX),
          item.pyOff + Math.ceil(-camY),
          CELL_WIDTH,
          item.img.naturalHeight
        )
      );
    }, 15);

    return () => clearInterval(worldLoop);
  }, [camX, camY, zoom]);

  useEffect(() => {
    const imageDiv = document.getElementById("loaded-images") as HTMLDivElement;
    textures.textures.forEach((t) => {
      const img = document.createElement("img");
      img.src = t.src;
      img.style.display = "none";
      img.id = t.src;
      imageDiv.appendChild(img);
    });
  }, []);

  return (
    <>
      <DefaultHead />
      <style jsx global>{`
        html {
          overflow: hidden;
        }

        body {
          position: relative;
          margin: 0px;
          padding: 0px;
          overflow: hidden;
          background-color: black;
          color: white;
        }
      `}</style>

      <canvas
        id="canvas-area"
        style={{
          backgroundColor: "black",
          imageRendering: "pixelated",
          zoom,
        }}
      ></canvas>
      <div id="loaded-images">
        <img id="housemap" src="/housemap.png" style={{ display: "none" }} />
      </div>
    </>
  );
}
