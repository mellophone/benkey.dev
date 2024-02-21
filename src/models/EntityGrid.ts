import EntityGridCell from "./EntityGridCell";
import WorldManager from "../handlers/WorldManager";
import Entity from "./Entity";
import { isoToArrGrid } from "../utils/gridConversions";

export default class EntityGrid {
  public grid: EntityGridCell[][] = [];

  constructor(public worldManager: WorldManager) {}

  public resetGrid = () => {
    const { imageLoader, mapObject } = this.worldManager;

    const mapImage = imageLoader.getLoadedImage(mapObject.mapSrc);
    const numRows = Math.floor((mapImage.height - 4) / 5);
    const numCols = Math.floor((mapImage.width - 10) / 20);

    this.grid = [];

    for (let i = 0; i < numRows; i++) {
      const iRow: EntityGridCell[] = [];
      for (let j = 0; j < numCols; j++) {
        iRow.push(new EntityGridCell(i, j));
      }
      this.grid.push(iRow);
    }
  };

  private getCell = (i: number, j: number) => {
    if (i < 0 || i >= this.grid.length) {
      return undefined;
    }
    if (j < 0 || j >= this.grid[i].length) {
      return undefined;
    }

    return this.grid[i][j];
  };

  private setCellValue = (i: number, j: number, value: Entity | null) => {
    const cell = this.getCell(i, j);
    if (!cell) return;
    cell.value = value;
  };

  public placeEntity = (entity: Entity) => {
    const [i, j] = isoToArrGrid(entity.r, entity.c);
    this.setCellValue(i, j, entity);
  };

  public removeEntity = (r: number, c: number) => {
    this.setCellValue(...isoToArrGrid(r, c), null);
  };

  public forEach = (callback: (cell: EntityGridCell) => void) => {
    this.grid.forEach((iRow) => iRow.forEach((cell) => callback(cell)));
  };

  public filter = (callback: (cell: EntityGridCell) => boolean) => {
    return this.grid.flat().filter(callback);
  };
}
