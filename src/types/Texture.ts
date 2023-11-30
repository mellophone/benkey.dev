export type StaticTexture = {
  src: string;
  pxOff: number;
  pyOff: number;
  filledCells: [number, number][];
  renderCells: [number, number][];
  interactiveCells: InteractiveCell[];
};

type InteractiveCell = {
  interaction: string;
  cell: [number, number];
};
