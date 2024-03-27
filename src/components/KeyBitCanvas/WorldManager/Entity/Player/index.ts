import Entity from "..";
import Mover from "../../../../../types/Mover";
import EntityGrid from "../../EntityGrid";
import ImageLoader from "../../FrameHandler/ImageLoader";
import { Direction, IsoCell, XYCoord } from "../../../../../types/Cell";

export default class Player extends Entity {
  private cellQueue: IsoCell[] = [];
  private leavingCell?: IsoCell;
  private playerMover = new Mover("w", "a", "s", "d");
  private frameNum = 0;
  private walkStart = -1;
  private direction = Direction.SE;
  private currentStep = new XYCoord(0, 0);

  constructor(spawnCell: IsoCell) {
    super("ben", "/ben0.png", spawnCell, 2, -10);
  }

  public getMovementCellQueue = () => {
    return [...this.cellQueue];
  };

  public setMoveState = (key: string, active: boolean): void => {
    this.playerMover.updateMoverState(key, active);
  };

  public getCurrentStep = (): XYCoord => {
    return this.currentStep.getCopy();
  };

  public think = (tNum: number, entityGrid: EntityGrid): void => {
    this.currentStep.x = 0;
    this.currentStep.y = 0;
    this.addDestinationFromButtons(entityGrid);

    const needsToMove = this.cellQueue.length > 0 || this.leavingCell;

    if (needsToMove) {
      this.handleMovement(tNum, entityGrid);
    }
  };

  public setDestination = (
    destination: IsoCell,
    entityGrid: EntityGrid
  ): void => {
    const isDestInTopRow = destination.c >= destination.r - 1;
    const isDestOutOfBounds = !entityGrid.isInGrid(destination);
    if (isDestInTopRow || isDestOutOfBounds) return;

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
      const isNearestOutOfBouds = !entityGrid.isInGrid(nearestCell);
      if (isNearestOutOfBouds) break;
      path.push(nearestCell);

      if (temp++ === 1000) {
        throw Error("Entity pathfinding loop exceeded max cycles!");
      }
    }

    path.shift();

    this.cellQueue = path;
  };

  public drawEntity = (
    context: CanvasRenderingContext2D,
    imageLoader: ImageLoader,
    cameraOffset: XYCoord
  ): void => {
    this.drawShadow(context, imageLoader, cameraOffset);
    this.drawPlayer(context, imageLoader, cameraOffset);
  };

  private addDestinationFromButtons = (entityGrid: EntityGrid): void => {
    if (this.leavingCell || this.cellQueue.length > 0) return;

    const nextCell = this.playerMover.getNextCell(this.currentCell);
    if (nextCell) this.setDestination(nextCell, entityGrid);
  };

  private handleMovement = (tNum: number, entityGrid: EntityGrid): void => {
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

    this.incrementFrame();
  };

  private startWalk = (tNum: number, entityGrid: EntityGrid): void => {
    const nextCell = this.cellQueue.shift();
    if (!nextCell) return;

    this.direction = this.currentCell.getDirectionTo(nextCell);

    this.leavingCell = this.currentCell;
    entityGrid.removeEntity(this.leavingCell);
    this.currentCell = nextCell;
    entityGrid.placeEntity(this, this.currentCell);
    this.walkStart = tNum;

    this.setDirectionOffset();
  };

  private setDirectionOffset = (): void => {
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

  private stopWalk = (entityGrid: EntityGrid): void => {
    if (this.leavingCell) {
      this.leavingCell = undefined;
    }
    this.addDestinationFromButtons(entityGrid);
    if (this.cellQueue.length === 0) {
      this.frameNum = 0;
    }
    this.walkStart = -1;
    this.xOffset = this.xiOffset;
    this.yOffset = this.yiOffset;
  };

  private incrementFrame = (): void => {
    this.frameNum = (this.frameNum % 4) + 1;

    const goingS =
      this.direction === Direction.SE || this.direction === Direction.SW;
    const goingE =
      this.direction === Direction.SE || this.direction === Direction.NE;

    this.currentStep.x = goingE ? 1 : -1;
    this.currentStep.y =
      ((this.frameNum + (goingS ? 0 : 1)) % 2) * (goingS ? 1 : -1);

    this.xOffset += this.currentStep.x;
    this.yOffset += this.currentStep.y;
  };

  private drawPlayer = (
    context: CanvasRenderingContext2D,
    imageLoader: ImageLoader,
    cameraOffset: XYCoord
  ): void => {
    const entityImage = imageLoader.getLoadedImage(this.textureName);
    const { x: mapX, y: mapY } = this.currentCell.toXYCoord();
    const { x: camX, y: camY } = cameraOffset;

    context.drawImage(
      entityImage,
      this.frameNum * this.width,
      this.direction * this.height,
      this.width,
      this.height,
      mapX + this.xOffset - camX,
      mapY + this.yOffset - camY,
      this.width,
      this.height
    );
  };

  private drawShadow = (
    context: CanvasRenderingContext2D,
    imageLoader: ImageLoader,
    cameraOffset: XYCoord
  ): void => {
    const shadowImage = imageLoader.getLoadedImage("/shadow.png");
    const { x: mapX, y: mapY } = this.currentCell.toXYCoord();
    const { x: camX, y: camY } = cameraOffset;

    context.drawImage(
      shadowImage,
      0,
      0,
      shadowImage.width,
      shadowImage.height,
      mapX + this.xOffset - camX,
      mapY + this.yOffset - camY,
      shadowImage.width,
      shadowImage.height
    );
  };
}
