import Entity from "./Entity";
import EntityGrid from "./EntityGrid";
import ImageLoader from "./FrameHandler/ImageLoader";
import MapObject from "@/types/MapObject";
import { IsoCell } from "../../../types/Cell";
import FrameHandler from "./FrameHandler";

const UPDATES_PER_SECOND = 40;
const FRAMES_PER_SECOND = 60;
const hertzToMs = (hertz: number) => 1000 / hertz;

export default class WorldManager {
  public frameHandler = new FrameHandler(this);
  public imageLoader = new ImageLoader(this.mapObject);
  public entityGrid = new EntityGrid(this);
  public ben: Entity | undefined;

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
    this.ben?.think(tNum);
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
