import Mover from "..";
import { IsoCell, XYCoord, CELL_HEIGHT, CELL_WIDTH } from "../../Cells";

export default class PlayerMover extends Mover {
  constructor(
    upKey: string,
    leftKey: string,
    downKey: string,
    rightKey: string
  ) {
    super(upKey, leftKey, downKey, rightKey);
  }

  public getNextCell = (currentCell: IsoCell): IsoCell | undefined => {
    const xMovement = this.getXMovement();
    const yMovement = this.getYMovement();

    if (xMovement === 0 || yMovement === 0) return;

    const { x: curX, y: curY } = currentCell.toCenterXYCoord();
    const nextX = curX + (xMovement * CELL_WIDTH) / 2;
    const nextY = curY + (yMovement * CELL_HEIGHT) / 2;

    const nextCell = new XYCoord(nextX, nextY).toIsoCell();
    return nextCell;
  };
}
