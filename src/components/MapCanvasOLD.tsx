/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
import { CELL_WIDTH } from "@/pages/mapmaker";
import { CameraSpecs, CanvasImageParams, Iso, MapObj } from "@/utils/types";
import { useEffect, useState } from "react";
import {
  isoToSnapPos,
  mousePosToIso,
  mousePosToSnapPos,
} from "./gridConversions";
import CameraManager from "@/utils/CameraManager";
import Entity from "@/utils/Entity";
import RenderObject from "@/utils/RenderObject";
import CollisionGrid from "@/utils/CollisionGrid";
import { text } from "node:stream/consumers";
import { MAP_ID, SELECTOR_ID } from "@/utils/constants";
import Ben from "@/utils/Ben";
import { getPathIsoList } from "./Pathfinding";

export const MapCanvas = (props: { mapObj: MapObj }) => {
  const { mapObj } = props;

  const [loadStatus, setLoadStatus] = useState(0);
  const [camSpecs, setCamSpecs] = useState<CameraSpecs>({
    camX: 0,
    camY: 0,
    zoom: 8,
  });
  const [correctedSpecs, setCorrectedSpecs] = useState<CameraSpecs>(camSpecs);
  const [grid, setGrid] = useState<CollisionGrid>({} as CollisionGrid);
  const [mouseIso, setMouseIso] = useState<Iso>([-1, -1]);
  const [ben, setBen] = useState<Ben>();

  // Initial Texture Loader
  useEffect(() => {
    let loadLeft = 3 + mapObj.textures.length;
    const lessenLoad = () => {
      loadLeft--;
      if (loadLeft <= 0) setLoadStatus(1);
    };

    const canvas = document.getElementById("canvas-area") as HTMLCanvasElement;

    const startImageLoad = (src: string, id: string) => {
      const img = document.createElement("img");
      img.src = src;
      img.style.display = "none";
      img.id = id;
      canvas.appendChild(img);
      img.onload = lessenLoad;
    };

    startImageLoad(mapObj.mapSrc, MAP_ID);
    startImageLoad("/selector.png", SELECTOR_ID);

    for (let i = 0; i < mapObj.textures.length; i++) {
      const texture = mapObj.textures[i];
      startImageLoad(texture.src, `${texture.src}-${i}`);
    }

    startImageLoad("/ben0.png", "ben");
  }, []);

  // Grid Creator
  useEffect(() => {
    if (loadStatus < 1) return;

    const mapImg = document.getElementById("map") as HTMLImageElement;
    const newGrid = new CollisionGrid(mapImg);

    const benImg = document.getElementById("ben") as HTMLImageElement;
    const newBen = new Ben({ grid: newGrid, img: benImg, isoInit: [16, -1] });
    setBen(newBen);

    for (let i = 0; i < mapObj.textures.length; i++) {
      const texture = mapObj.textures[i];
      for (let j = 0; j < texture.filledCells.length; j++) {
        const cell = texture.filledCells[j];
        newGrid.fillCell(cell);
      }
      for (let j = 0; j < texture.interactiveCells.length; j++) {
        const icell = texture.interactiveCells[j];
        newGrid.setCellInteraction(icell.cell, icell.interaction);
      }
    }

    setGrid(newGrid);
    setLoadStatus(2);
  }, [loadStatus]);

  // Camera Corrector
  useEffect(() => {
    if (loadStatus < 2) return;
    const canvas = document.getElementById("canvas-area") as HTMLCanvasElement;
    const map = document.getElementById("map") as HTMLImageElement;
    const handleCameraMove = () => {
      const benXY = ben?.getXY();

      const { camX, camY, zoom } = camSpecs;
      const camera = new CameraManager({
        x: camX,
        y: camY,
        zoom,
        mapWidth: map.naturalWidth,
        mapHeight: map.naturalHeight,
        centerX: benXY && benXY[0],
        centerY: benXY && benXY[1],
      });

      const cameraSpecs = camera.getCorrectedSpecs();
      setCorrectedSpecs(cameraSpecs);
    };
    handleCameraMove();
    window.onresize = handleCameraMove;
  }, [camSpecs, loadStatus]);

  // Canvas Painter
  useEffect(() => {
    if (loadStatus < 2) return;
    const canvas = document.getElementById("canvas-area") as HTMLCanvasElement;
    const map = document.getElementById("map") as HTMLImageElement;

    const { camX, camY, zoom } = correctedSpecs;

    const worldLoop = setInterval(() => {
      const canvas = document.getElementById(
        "canvas-area"
      ) as HTMLCanvasElement;
      const context = canvas.getContext("2d") as CanvasRenderingContext2D;
      canvas.width = map.naturalWidth;
      canvas.height = map.naturalHeight;
      context.clearRect(0, 0, map.naturalWidth, map.naturalHeight);
      const cxOff = Math.ceil(-camX);
      const cyOff = Math.ceil(-camY);
      context.drawImage(map, cxOff, cyOff);

      const { textures } = mapObj;

      const renderObjects: RenderObject[] = [];

      renderObjects.push(...grid.getInteractionRenderObjects("path"));

      for (let i = 0; i < textures.length; i++) {
        const texture = textures[i];
        const { src, pxOff, pyOff } = texture;
        const textureImg = document.getElementById(
          `${src}-${i}`
        ) as HTMLImageElement;

        const textureEntity = new Entity({
          img: textureImg,
          texture,
          priority: i,
        });
        renderObjects.push(...textureEntity.getRenderObjects());
      }

      if (ben) renderObjects.push(...ben.getRenderObjects());

      renderObjects.sort((a, b) => a.getZIndex() - b.getZIndex());

      const [mouseR, mouseC] = mouseIso;
      const [mouseSnapX, mouseSnapY] = isoToSnapPos(mouseR, mouseC);
      const selector = document.getElementById("selector") as HTMLImageElement;
      context.drawImage(
        selector,
        mouseSnapX - 1 + cxOff,
        mouseSnapY - 1 + cyOff
      );

      renderObjects.forEach((renderObject) => {
        const canvasImageParams = renderObject.getCanvasImageParams();
        const cipCopy: CanvasImageParams = [...canvasImageParams];
        cipCopy[5] += cxOff;
        cipCopy[6] += cyOff;
        context.drawImage(...cipCopy);
      });
    }, 10);

    return () => clearInterval(worldLoop);
  }, [correctedSpecs, loadStatus, mouseIso]);

  return (
    <canvas
      id="canvas-area"
      style={{
        backgroundColor: "black",
        imageRendering: "pixelated",
        zoom: correctedSpecs.zoom,
      }}
      onMouseMove={(ev) => {
        const { camX, camY, zoom } = correctedSpecs;
        const mouseX = ev.clientX / zoom - Math.ceil(-camX);

        const mouseY = ev.clientY / zoom - Math.ceil(-camY);

        const newSnap = mousePosToIso(mouseX, mouseY);

        if (newSnap[0] !== mouseIso[0] || newSnap[1] !== mouseIso[1])
          setMouseIso(newSnap);
      }}
      onMouseLeave={() => setMouseIso([-1, -1])}
      onClick={() => {
        if (!ben) return;
        const curCell = grid.getCell(mouseIso);
        const benCell = ben.getIso();
        const pathList = getPathIsoList(benCell, mouseIso);
        pathList.forEach((cell) => grid.setCellInteraction(cell, "path"));
        // console.log(`${mouseIso} ${JSON.stringify(curCell)}`);
      }}
    ></canvas>
  );
};
