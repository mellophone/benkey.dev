import Entity from "../models/Entity";
import EntityGrid from "../models/EntityGrid";
import CameraHandler from "./CameraHandler";
import FrameDrawer from "./FrameDrawer";
import ImageLoader from "./ImageLoader";
import { IsoCell } from "../types/Cell";
import { MapObject } from "@/types/MapObject";

const UPDATES_PER_SECOND = 40;
const FRAMES_PER_SECOND = 60;
const hertzToMs = (hertz: number) => 1000 / hertz;

export default class WorldManager {
  public imageLoader = new ImageLoader(this.mapObject);
  public frameDrawer = new FrameDrawer(this);
  public entityGrid = new EntityGrid(this);
  public cameraHandler = new CameraHandler(this);
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
      this.frameDrawer.drawCurrentFrame(fNum);
      fNum++;
    }, hertzToMs(FRAMES_PER_SECOND));
  };

  public stopFrameLoop = () => {
    clearInterval(this.frameLoop);
  };
}
