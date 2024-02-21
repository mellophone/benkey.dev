import { PIXEL_MAG } from "@/pages/mapmaker";

export class IsoCell {
  constructor(public r: number, public c: number) {}

  toMatrixCell = (): MatrixCell => {
    const { r, c } = this;
    const i = r - c;
    const j = c + Math.floor((r - c) / 2);

    return new MatrixCell(i, j);
  };

  toXYCoord = (): XYCoord => {
    const { r, c } = this;
    const x = PIXEL_MAG * 10 * (r + c);
    const y = PIXEL_MAG * 5 * (r - c);

    return new XYCoord(x, y);
  };

  getDirectionTo = (toCell: IsoCell) => {
    const [r1, c1] = [this.r, this.c];
    const [r2, c2] = [toCell.r, toCell.c];

    if (r1 < r2) {
      return Direction.SE;
    } else if (r1 > r2) {
      return Direction.NW;
    } else if (c1 < c2) {
      return Direction.NE;
    } else if (c1 > c2) {
      return Direction.SW;
    } else {
      return Direction.SE;
    }
  };

  getNearbyCellsFacing = (facingCell: IsoCell): IsoCell[] => {
    const [r1, c1] = [this.r, this.c];
    const [r2, c2] = [facingCell.r, facingCell.c];
    const cells: IsoCell[] = [];

    if (r2 > r1) {
      cells.push(new IsoCell(r1 + 1, c1));
    }
    if (r2 < r1) {
      cells.push(new IsoCell(r1 - 1, c1));
    }
    if (c2 > c1) {
      cells.push(new IsoCell(r1, c1 + 1));
    }
    if (c2 < c1) {
      cells.push(new IsoCell(r1, c1 - 1));
    }

    return cells;
  };

  getDistanceTo = (distanceCell: IsoCell) => {
    const [r1, c1] = [this.r, this.c];
    const [r2, c2] = [distanceCell.r, distanceCell.c];

    return Math.sqrt(Math.pow(r1 - r2, 2) + Math.pow(c1 - c2, 2));
  };

  equals = (comparisonCell: IsoCell) => {
    const [r1, c1] = [this.r, this.c];
    const [r2, c2] = [comparisonCell.r, comparisonCell.c];

    return r1 === r2 && c1 === c2;
  };
}

export class MatrixCell {
  constructor(public i: number, public j: number) {}

  toIsoCell = (): IsoCell => {
    const { i, j } = this;
    const r = i + j - Math.floor(i / 2);
    const c = j - Math.floor(i / 2);

    return new IsoCell(r, c);
  };

  toXYCoord = (): XYCoord => {
    return this.toIsoCell().toXYCoord();
  };
}

export class XYCoord {
  constructor(public x: number, public y: number) {}

  toIsoCell = (): IsoCell => {
    const { x, y } = this;
    const r = Math.floor(
      (y + (1 / 2) * x - 4.5 * PIXEL_MAG) / (PIXEL_MAG * 10)
    );
    const c = Math.floor(
      -(y - (1 / 2) * x - 4.5 * PIXEL_MAG) / (PIXEL_MAG * 10)
    );

    return new IsoCell(r, c);
  };

  toMatrixCell = (): MatrixCell => {
    return this.toIsoCell().toMatrixCell();
  };

  toSnapXYCoord = (): XYCoord => {
    return this.toIsoCell().toXYCoord();
  };

  equals = (comparisonCell: XYCoord) => {
    const [x1, y1] = [this.x, this.y];
    const [x2, y2] = [comparisonCell.x, comparisonCell.y];

    return x1 === x2 && y1 === y2;
  };
}

export enum Direction {
  SE,
  SW,
  NW,
  NE,
}
