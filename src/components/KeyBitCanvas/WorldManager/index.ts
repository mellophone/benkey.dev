import EntityGrid from "./EntityGrid";
import FrameHandler from "./FrameHandler";
import MapObject from "@/types/MapObject";
import Player from "./Entity/Player";
import { IsoCell } from "../../../types/Cell";

const UPDATES_PER_SECOND = 40;
const FRAMES_PER_SECOND = 60;
const hertzToMs = (hertz: number) => 1000 / hertz;

export default class WorldManager {
  private player = new Player(new IsoCell(1, -1));
  private entityGrid = new EntityGrid(this);
  private frameHandler = new FrameHandler(this, this.player, this.mapObject);

  public devMode = false;
  private worldLoop?: NodeJS.Timer;
  private frameLoop?: NodeJS.Timer;

  constructor(
    public canvas: HTMLCanvasElement,
    private readonly mapObject: MapObject
  ) {
    this.frameHandler.onImageLoadingComplete(this.startWorld);
    this.frameHandler.startImageLoading(canvas);
  }

  public startWorld = () => {
    this.frameHandler.temporaryStart(this.entityGrid);
    this.entityGrid.resetGrid(this.mapObject);
    this.startWorldLoop();
    this.startFrameLoop();
    this.player.placeInGrid(this.entityGrid);
    this.frameHandler.resizeCanvas();
  };

  public startWorldLoop = () => {
    let tNum = 0;
    this.worldLoop = setInterval(() => {
      this.manageUpdates(tNum);
      tNum++;
    }, hertzToMs(UPDATES_PER_SECOND));
  };

  public manageUpdates = (tNum: number) => {
    if (!this.player) return;

    this.player.think(tNum, this.entityGrid);

    const { cameraOffset, updateCamera, walkableAreaRelativeCoord } =
      this.frameHandler;

    const xyDestination = this.player.getCurrentCell().toCenterXYCoord();

    const { x, y } = walkableAreaRelativeCoord(xyDestination);
    const { x: xStep, y: yStep } = this.player.getCurrentStep();

    cameraOffset.x += x === xStep ? xStep : 0;
    cameraOffset.y += y === yStep ? yStep : 0;

    updateCamera();
  };

  public stopWorldLoop = () => {
    clearInterval(this.worldLoop);
  };

  public startFrameLoop = () => {
    let fNum = 0;
    this.frameLoop = setInterval(() => {
      this.frameHandler.drawCurrentFrame(this.entityGrid);
      fNum++;
    }, hertzToMs(FRAMES_PER_SECOND));
  };

  public stopFrameLoop = () => {
    clearInterval(this.frameLoop);
  };
}
