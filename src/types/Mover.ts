import { CELL_HEIGHT, CELL_WIDTH } from "../pages/mapmaker";
import { IsoCell, XYCoord } from "./Cell";

export default class Mover {
  private up: boolean = false;
  private left: boolean = false;
  private down: boolean = false;
  private right: boolean = false;

  constructor(
    private upKey: string,
    private leftKey: string,
    private downKey: string,
    private rightKey: string
  ) {}

  public updateMoverState = (key: string, active: boolean) => {
    switch (key) {
      case this.upKey:
        this.up = active;
        return;
      case this.leftKey:
        this.left = active;
        return;
      case this.downKey:
        this.down = active;
        return;
      case this.rightKey:
        this.right = active;
        return;
    }
  };

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

  private getXMovement = () => (this.right ? 1 : 0) + (this.left ? -1 : 0);

  private getYMovement = () => (this.down ? 1 : 0) + (this.up ? -1 : 0);
}
