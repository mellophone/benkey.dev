import {
  arrGridToIso,
  isoToArrGrid,
  isoToSnapPos,
} from "@/components/gridConversions";
import { CELL_HEIGHT, CELL_WIDTH, SELECTOR_ID } from "./constants";
import { GridCell, Iso } from "./types";
import RenderObject from "./RenderObject";

class CollisionGrid {
  private grid: GridCell[][];

  constructor(img: HTMLImageElement) {
    const grid: GridCell[][] = [];

    const rows =
      (img.naturalHeight - Math.floor(CELL_HEIGHT / 2)) /
      Math.ceil(CELL_HEIGHT / 2);
    const cols = (img.naturalWidth - CELL_WIDTH / 2) / (CELL_WIDTH / 2);

    // if (rows % 1 !== 0 || cols % 1 !== 0) throw Error("Map Dimensions Illegal");

    for (let r = 0; r < rows; r++) {
      const row: GridCell[] = [];
      for (let c = 0; c < cols; c++) {
        row.push({
          filled: false,
          interaction: "",
        });
      }
      grid.push(row);
    }

    this.grid = grid;
  }

  getCell = (iso: Iso): GridCell => {
    const [r, c] = iso;
    const [i, j] = isoToArrGrid(r, c);
    try {
      return this.grid[i][j];
    } catch (e) {
      return { filled: true, interaction: "" };
    }
  };

  fillCell = (iso: Iso) => {
    const [r, c] = iso;
    const [i, j] = isoToArrGrid(r, c);
    try {
      this.grid[i][j].filled = true;
    } catch (e) {}
  };

  unfillCell = (iso: Iso) => {
    const [r, c] = iso;
    const [i, j] = isoToArrGrid(r, c);
    try {
      this.grid[i][j].filled = false;
    } catch (e) {}
  };

  setCellInteraction = (iso: Iso, interaction: string) => {
    const [r, c] = iso;
    const [i, j] = isoToArrGrid(r, c);
    try {
      this.grid[i][j].interaction = interaction;
    } catch (e) {}
  };

  getInteractionRenderObjects = (interaction: string): RenderObject[] => {
    const renderObjects: RenderObject[] = [];

    for (let i = 0; i < this.grid.length; i++) {
      const irow = this.grid[i];
      for (let j = 0; j < irow.length; j++) {
        const [r, c] = arrGridToIso(i, j);
        const [x, y] = isoToSnapPos(r, c);
        if (this.grid[i][j].interaction === interaction) {
          const renderObject = new RenderObject({
            img: document.getElementById(SELECTOR_ID) as HTMLImageElement,
            pxOff: x - 1,
            pyOff: y - 1,
            renderCell: [r, c],
          });
          renderObjects.push(renderObject);
        }
      }
    }

    return renderObjects;
  };
}

export default CollisionGrid;
