import EntityGridCell from "./EntityGridCell";
import Entity from "../Entity";
import MapObject from "../../../../types/MapObject";
import { IsoCell, MatrixCell } from "../Cells";

export default class EntityGrid {
  private grid: EntityGridCell[][] = [];

  constructor() {}

  public resetGrid = (mapObject: MapObject): void => {
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

  public isWalkable = (cell: IsoCell): boolean => {
    const isUnderTopTwoRows = cell.c < cell.r - 1;
    return isUnderTopTwoRows && this.isInGrid(cell);
  };

  public placeEntity = (entity: Entity, cell: IsoCell): void => {
    const matrixCell = cell.toMatrixCell();
    this.setCellValue(matrixCell, entity);
  };

  public removeEntity = (isoCell: IsoCell): void => {
    const matrixCell = isoCell.toMatrixCell();
    this.setCellValue(matrixCell, null);
  };

  public forEach = (callback: (cell: EntityGridCell) => void): void => {
    this.grid.forEach((iRow) => iRow.forEach((cell) => callback(cell)));
  };

  private getCell = (matrixCell: MatrixCell): EntityGridCell | undefined => {
    const { i, j } = matrixCell;

    if (i < 0 || i >= this.grid.length) {
      return undefined;
    }
    if (j < 0 || j >= this.grid[i].length) {
      return undefined;
    }

    return this.grid[i][j];
  };

  private setCellValue = (
    matrixCell: MatrixCell,
    value: Entity | null
  ): void => {
    const cell = this.getCell(matrixCell);
    if (!cell) return;
    cell.value = value;
  };
}
