import EntityGridCell from "./EntityGridCell";
import WorldManager from "..";
import Entity from "../Entity";
import MapObject from "../../../../types/MapObject";
import { IsoCell, MatrixCell } from "../../../../types/Cell";

export default class EntityGrid {
  public grid: EntityGridCell[][] = [];

  constructor(public worldManager: WorldManager) {}

  public resetGrid = (mapObject: MapObject) => {
    const numRows = Math.floor((mapObject.height - 4) / 5);
    const numCols = Math.floor((mapObject.width - 10) / 20);

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

  public isInGrid = (cell: IsoCell): boolean => {
    const matrixCell = cell.toMatrixCell();
    return !!this.getCell(matrixCell);
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

  public placeEntity = (entity: Entity, cell: IsoCell) => {
    const matrixCell = cell.toMatrixCell();
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
