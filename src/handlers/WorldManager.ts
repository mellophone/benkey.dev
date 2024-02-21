import Entity from "../models/Entity";
import EntityGrid from "../models/EntityGrid";
import { mousePosToIso } from "../utils/gridConversions";
import FrameDrawer from "./FrameDrawer";
import ImageLoader from "./ImageLoader";
import { MapObject } from "@/types/MapObject";

const UPDATES_PER_SECOND = 40;
const FRAMES_PER_SECOND = 60;
const hertzToMs = (hertz: number) => 1000 / hertz;

export default class WorldManager {
  public context: CanvasRenderingContext2D;
  public mouse: [number, number] = [-20, -20];
  public imageLoader = new ImageLoader(this.mapObject);
  public frameDrawer = new FrameDrawer(this);
  public entityGrid = new EntityGrid(this);
  public ben: Entity | undefined;

  public devMode = false;
  private worldLoop?: NodeJS.Timer;
  private frameLoop?: NodeJS.Timer;

  constructor(
    public canvas: HTMLCanvasElement,
    public readonly mapObject: MapObject
  ) {
    const canvasContext = canvas.getContext("2d");
    if (!canvasContext) throw Error("Cannot retrieve 2d canvas context!");
    this.context = canvasContext;

    this.startAutomaticResizing();
    this.canvas.onmousemove = this.mouseMoveListener;
    this.canvas.onkeydown = this.keyDownListener;
    this.canvas.onmousedown = this.mouseDownListener;

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
      1,
      -1,
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

  public mouseMoveListener = (ev: MouseEvent) => {
    const zoom = this.canvas.style.getPropertyValue("zoom");
    if (!zoom) throw Error("Cannot find zoom property on MapCanvas!");

    this.mouse[0] = ev.x / parseInt(zoom);
    this.mouse[1] = ev.y / parseInt(zoom);
  };

  public mouseDownListener = (ev: MouseEvent) => {
    const zoom = this.canvas.style.getPropertyValue("zoom");
    if (!zoom) throw Error("Cannot find zoom property on MapCanvas!");

    const destination = mousePosToIso(
      ev.x / parseInt(zoom),
      ev.y / parseInt(zoom)
    );
    this.ben?.setDestination(...destination);
  };

  public keyDownListener = (ev: KeyboardEvent) => {
    if (ev.key.toLocaleLowerCase() === "`") {
      this.devMode = !this.devMode;
    }
  };

  public startAutomaticResizing = () => {
    const resizeCanvas = () => {
      console.log(`Canvas size: ${this.canvas.width} x ${this.canvas.height}`);
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.onresize = resizeCanvas;
  };

  public preventMobileGesture = () => {
    document.addEventListener("gesturestart", (e) => {
      e.preventDefault();
    });
  };
}
