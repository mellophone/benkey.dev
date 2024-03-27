import WorldManager from "..";
import { Direction, IsoCell } from "../../../../types/Cell";
import EntityGrid from "../EntityGrid";

export default class Entity {
  public cellQueue: IsoCell[] = [];
  public leavingCell?: IsoCell;
  public frameNum = 0;
  public walkStart = -1;
  public direction = Direction.SE;
  public xOffset: number;
  public yOffset: number;
  public collision = true;
  public dx: number = 0;
  public dy: number = 0;

  constructor(
    public worldManager: WorldManager,
    public name: string,
    public textureName: string,
    public currentCell: IsoCell,
    public xiOffset = 0,
    public yiOffset = 0,
    public w = 16,
    public h = 16
  ) {
    this.xOffset = xiOffset;
    this.yOffset = yiOffset;
  }

  private addDestinationFromButtons = () => {
    if (this.leavingCell || this.cellQueue.length > 0) return;
    const { playerMover } = this.worldManager;

    const nextCell = playerMover.getNextCell(this.currentCell);
    if (nextCell) this.setDestination(nextCell);
  };

  public think = (tNum: number, entityGrid: EntityGrid) => {
    this.dx = 0;
    this.dy = 0;
    this.addDestinationFromButtons();

    const needsToMove = this.cellQueue.length > 0 || this.leavingCell;

    if (needsToMove) {
      this.handleMovement(tNum, entityGrid);
    }
  };

  public handleMovement = (tNum: number, entityGrid: EntityGrid) => {
    if (this.walkStart < 0) {
      this.startWalk(tNum, entityGrid);
    }

    const dt = tNum - this.walkStart;
    const framePeriod = 2;
    const nextFrameReady = dt % framePeriod === 0;
    const sequenceIndex = Math.floor(dt / framePeriod);

    if (!nextFrameReady) return;

    if (sequenceIndex === 10) {
      this.stopWalk(entityGrid);
      return;
    }

    this.setNextFrame();
  };

  public startWalk = (tNum: number, entityGrid: EntityGrid) => {
    const nextCell = this.cellQueue.shift();
    if (!nextCell) return;

    this.direction = this.currentCell.getDirectionTo(nextCell);

    this.leavingCell = this.currentCell;
    this.currentCell = nextCell;
    entityGrid.placeEntity(this);
    this.walkStart = tNum;

    this.setDirectionOffset();
  };

  private setDirectionOffset = () => {
    switch (this.direction) {
      case Direction.SE:
        this.xOffset -= 10;
        this.yOffset -= 5;
        break;
      case Direction.NE:
        this.xOffset -= 10;
        this.yOffset += 5;
        break;
      case Direction.NW:
        this.xOffset += 10;
        this.yOffset += 5;
        break;
      case Direction.SW:
        this.xOffset += 10;
        this.yOffset -= 5;
        break;
      default:
        break;
    }
  };

  public stopWalk = (entityGrid: EntityGrid) => {
    if (this.leavingCell) {
      entityGrid.removeEntity(this.leavingCell);
      this.leavingCell = undefined;
    }
    this.addDestinationFromButtons();
    if (this.cellQueue.length === 0) {
      this.frameNum = 0;
    }
    this.walkStart = -1;
    this.xOffset = this.xiOffset;
    this.yOffset = this.yiOffset;
  };

  public setNextFrame = () => {
    this.frameNum = (this.frameNum % 4) + 1;

    const goingS =
      this.direction === Direction.SE || this.direction === Direction.SW;
    const goingE =
      this.direction === Direction.SE || this.direction === Direction.NE;

    this.dx = goingE ? 1 : -1;
    this.dy = ((this.frameNum + (goingS ? 0 : 1)) % 2) * (goingS ? 1 : -1);

    this.xOffset += this.dx;
    this.yOffset += this.dy;
  };

  public setDestination = (destination: IsoCell) => {
    if (destination.c >= destination.r - 1) return;
    if (destination.c <= -destination.r - 1) return;

    const path: IsoCell[] = [this.currentCell];

    let temp = 0;
    while (!path[path.length - 1].equals(destination)) {
      const cur = path.pop();
      if (!cur) throw Error("Entity pathfinding loop path is empty!");

      const nearby = cur.getNearbyCellsFacing(destination);
      const distances = nearby.map(
        (cell) =>
          cell.getDistanceTo(destination) + cell.getDistanceTo(this.currentCell)
      );

      const minDistance = Math.min(...distances);
      const nearestIndex = distances.indexOf(minDistance);
      const nearestCell = nearby[nearestIndex];
      path.push(cur);
      path.push(nearestCell);

      if (temp++ === 1000) {
        throw Error("Entity pathfinding loop exceeded max cycles!");
      }
    }

    path.shift();

    this.cellQueue = path;
  };

  public getDrawValues = () => {
    const { x, y } = this.currentCell.toXYCoord();

    return [
      this.frameNum * 16,
      this.direction * 16,
      this.w,
      this.h,
      x + this.xOffset,
      y + this.yOffset,
      this.w,
      this.h,
    ] as const;
  };
}
