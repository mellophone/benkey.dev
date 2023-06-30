import CollisionGrid from "./CollisionGrid";

export type Iso = [number, number];

export type ICell = {
  cell: Iso;
  interaction: string;
};

export type Texture = {
  src: string;
  pxOff: number;
  pyOff: number;
  filledCells: Iso[];
  renderCells: Iso[];
  interactiveCells: ICell[];
};

export type MapObj = {
  mapName: string;
  mapSrc: string;
  textures: Texture[];
};

export type CameraSpecs = {
  camX: number;
  camY: number;
  zoom: number;
};

export type CameraProps = {
  x: number;
  y: number;
  zoom: number;
  mapWidth: number;
  mapHeight: number;
  centerX?: number;
  centerY?: number;
};

export type EntityProps = {
  img: HTMLImageElement;
  texture: Texture;
  priority?: number;
};

export type RenderObjectProps = {
  img: HTMLImageElement;
  renderCell: Iso;
  pxOff: number;
  pyOff: number;
  priority?: number;
};

export type CanvasImageParams = [
  image: CanvasImageSource,
  sx: number,
  sy: number,
  sw: number,
  sh: number,
  dx: number,
  dy: number,
  dw: number,
  dh: number
];

export type GridCell = {
  filled: boolean;
  interaction: string;
};

export type FrameSpecs = {
  frameWidth: number;
  frameHeight: number;
  frameX: number;
  frameY: number;
};

export type SpriteProps = {
  grid: CollisionGrid;
  img: HTMLImageElement;
  isoInit: Iso;
};

export type Direction = "NE" | "SE" | "SW" | "NW";
