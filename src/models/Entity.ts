import WorldManager from "../handlers/WorldManager";
import { getX, getY } from "../utils/gridConversions";

export default class Entity {
  public cellQueue: [number, number][] = [];
  public leavingCell?: [number, number];
  public frameNum = 0;
  public walkStart = -1;
  public direction = Direction.SE;
  public xOffset: number;
  public yOffset: number;

  constructor(
    public worldManager: WorldManager,
    public name: string,
    public texture: HTMLImageElement,
    public r: number,
    public c: number,
    public xiOffset = 0,
    public yiOffset = 0,
    public w = 16,
    public h = 16
  ) {
    this.xOffset = xiOffset;
    this.yOffset = yiOffset;
  }

  public think = (tNum: number) => {
    if (this.cellQueue.length > 0 || this.leavingCell) {
      this.handleMovement(tNum);
    }
  };

  public handleMovement = (tNum: number) => {
    if (this.walkStart < 0) {
      this.startWalk(tNum);
    }

    const dt = tNum - this.walkStart;
    const framePeriod = 3;
    const nextFrameReady = dt % framePeriod === 0;
    const sequenceIndex = Math.floor(dt / framePeriod);

    if (!nextFrameReady) return;

    if (sequenceIndex === 10) {
      this.stopWalk();
      return;
    }

    this.setNextFrame();
  };

  public startWalk = (tNum: number) => {
    const pop = this.cellQueue.shift();
    if (!pop) return;

    this.direction = this.getDirectionTo(...pop);

    this.leavingCell = [this.r, this.c];
    [this.r, this.c] = pop;
    this.worldManager.entityGrid.placeEntity(this);
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

  public getDirectionTo = (r: number, c: number) => {
    if (this.r < r) {
      return Direction.SE;
    } else if (this.r > r) {
      return Direction.NW;
    } else if (this.c < c) {
      return Direction.NE;
    } else if (this.c > c) {
      return Direction.SW;
    } else {
      return this.direction;
    }
  };

  public stopWalk = () => {
    if (this.leavingCell) {
      this.worldManager.entityGrid.removeEntity(...this.leavingCell);
    }
    if (this.cellQueue.length === 0) {
      this.frameNum = 0;
    }
    this.leavingCell = undefined;
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

    this.xOffset += goingE ? 1 : -1;
    this.yOffset +=
      ((this.frameNum + (goingS ? 0 : 1)) % 2) * (goingS ? 1 : -1);
  };

  public setDestination = (r: number, c: number) => {
    const path: [number, number][] = [[this.r, this.c]];

    let temp = 0;
    while (path[path.length - 1][0] !== r || path[path.length - 1][1] !== c) {
      const cur = path.pop();
      if (!cur) throw Error("Entity pathfinding loop path is empty!");

      const nearby = this.getFacingCells(...cur, r, c);
      const distances = nearby.map(
        (cell) =>
          this.getDistanceBetween(r, c, ...cell) +
          this.getDistanceBetween(this.r, this.c, ...cell)
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

  private getFacingCells = (
    r1: number,
    c1: number,
    r2: number,
    c2: number
  ): [number, number][] => {
    const cells: [number, number][] = [];

    if (r2 > r1) {
      cells.push([r1 + 1, c1]);
    }
    if (r2 < r1) {
      cells.push([r1 - 1, c1]);
    }
    if (c2 > c1) {
      cells.push([r1, c1 + 1]);
    }
    if (c2 < c1) {
      cells.push([r1, c1 - 1]);
    }

    return cells;
  };

  private getDistanceBetween = (
    r1: number,
    c1: number,
    r2: number,
    c2: number
  ) => {
    return Math.sqrt(Math.pow(r1 - r2, 2) + Math.pow(c1 - c2, 2));
  };

  public getDrawValues = () =>
    [
      this.texture,
      this.frameNum * 16,
      this.direction * 16,
      this.w,
      this.h,
      getX(this.r, this.c) + this.xOffset,
      getY(this.r, this.c) + this.yOffset,
      this.w,
      this.h,
    ] as const;
}

enum Direction {
  SE,
  SW,
  NW,
  NE,
}
