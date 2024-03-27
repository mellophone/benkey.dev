import Entity from "./Entity";
import EntityGrid from "./EntityGrid";
import ImageLoader from "./FrameHandler/ImageLoader";
import FrameHandler from "./FrameHandler";
import MapObject from "@/types/MapObject";
import { IsoCell } from "../../../types/Cell";
import { Mover } from "../../../types/Mover";

const UPDATES_PER_SECOND = 40;
const FRAMES_PER_SECOND = 60;
const hertzToMs = (hertz: number) => 1000 / hertz;

export default class WorldManager {
  private frameHandler = new FrameHandler(this);
  public imageLoader = new ImageLoader(this.mapObject);
  public entityGrid = new EntityGrid(this);
  public ben: Entity | undefined;

  public playerMover = new Mover("w", "a", "s", "d");

  public devMode = false;
  private worldLoop?: NodeJS.Timer;
  private frameLoop?: NodeJS.Timer;

  constructor(
    public canvas: HTMLCanvasElement,
    public readonly mapObject: MapObject
  ) {
    this.imageLoader.onLoadingComplete = this.startWorld;
    this.imageLoader.startImageLoading(canvas);
  }

  public startWorld = () => {
    this.frameHandler.temporaryStart();
    this.entityGrid.resetGrid();
    this.startWorldLoop();
    this.startFrameLoop();

    this.ben = new Entity(
      this,
      "ben",
      this.imageLoader.getLoadedImage("/ben0.png"),
      new IsoCell(1, -1),
      2,
      -10
    );
    this.entityGrid.placeEntity(this.ben);
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
    if (!this.ben) return;

    this.ben.think(tNum);

    const { cameraOffset, updateCamera, walkableAreaRelativeCoord } =
      this.frameHandler;

    const xyDestination = this.ben.currentCell.toCenterXYCoord();

    const { x, y } = walkableAreaRelativeCoord(xyDestination);

    const { dx, dy } = this.ben;

    cameraOffset.x += x === dx ? dx : 0;
    cameraOffset.y += y === dy ? dy : 0;

    updateCamera();
  };

  public stopWorldLoop = () => {
    clearInterval(this.worldLoop);
  };

  public startFrameLoop = () => {
    let fNum = 0;
    this.frameLoop = setInterval(() => {
      this.frameHandler.drawCurrentFrame(fNum);
      fNum++;
    }, hertzToMs(FRAMES_PER_SECOND));
  };

  public stopFrameLoop = () => {
    clearInterval(this.frameLoop);
  };
}
