type MapObject = {
  mapName: string;
  mapSrc: string;
  textures: Texture[];
};

export type Texture = {
  src: string;
  pxOff: number;
  pyOff: number;
  filledCells: Cell[];
  renderCells: Cell[];
  interactiveCells: InteractiveCell[];
};

export type Cell = [number, number];

export type InteractiveCell = {
  interaction: string;
  cell: Cell;
};

export default MapObject;
