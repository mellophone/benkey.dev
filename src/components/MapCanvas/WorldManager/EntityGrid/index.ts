import EntityGridCell from "./EntityGridCell";
import WorldManager from "..";
import Entity from "../Entity";
import { IsoCell, MatrixCell } from "../../../../types/Cell";

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
        const matrixCell = new MatrixCell(i, j);
        const entityGridCell = new EntityGridCell(matrixCell);
        iRow.push(entityGridCell);
      }
      this.grid.push(iRow);
    }
  };

  private getCell = (matrixCell: MatrixCell) => {
    const { i, j } = matrixCell;

    if (i < 0 || i >= this.grid.length) {
      return undefined;
    }
    if (j < 0 || j >= this.grid[i].length) {
      return undefined;
    }

    return this.grid[i][j];
  };

  private setCellValue = (matrixCell: MatrixCell, value: Entity | null) => {
    const cell = this.getCell(matrixCell);
    if (!cell) return;
    cell.value = value;
  };

  public placeEntity = (entity: Entity) => {
    const matrixCell = entity.currentCell.toMatrixCell();
    this.setCellValue(matrixCell, entity);
  };

  public removeEntity = (isoCell: IsoCell) => {
    const matrixCell = isoCell.toMatrixCell();
    this.setCellValue(matrixCell, null);
  };

  public forEach = (callback: (cell: EntityGridCell) => void) => {
    this.grid.forEach((iRow) => iRow.forEach((cell) => callback(cell)));
  };

  public filter = (callback: (cell: EntityGridCell) => boolean) => {
    return this.grid.flat().filter(callback);
  };
}
