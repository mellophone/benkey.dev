import ImageLoader from "./ImageLoader";
import { MapObject } from "@/types/MapObject";
import { mousePosToSnapPos } from "../utils/gridConversions";

const UPDATES_PER_SECOND = 40;
const FRAMES_PER_SECOND = 60;
const hertzToMs = (hertz: number) => 1000 / hertz;

export default class WorldManager {
  public context: CanvasRenderingContext2D;
  public imageLoader = new ImageLoader(this.mapObject);
  public mouse: [number, number] = [0, 0];

  private devMode = false;
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

    this.imageLoader.onLoadingComplete = this.startWorld;
    this.imageLoader.startImageLoading(canvas);
  }

  public startWorld = () => {
    this.startWorldLoop();
    this.startFrameLoop();
  };

  public startWorldLoop = () => {
    this.worldLoop = setInterval(
      this.manageUpdates,
      hertzToMs(UPDATES_PER_SECOND)
    );
  };

  public manageUpdates = () => {};

  public stopWorldLoop = () => {
    clearInterval(this.worldLoop);
  };

  public startFrameLoop = () => {
    this.frameLoop = setInterval(
      this.drawCurrentFrame,
      hertzToMs(FRAMES_PER_SECOND)
    );
  };

  public drawCurrentFrame = () => {
    const mapImage = this.imageLoader.getLoadedImage(this.mapObject.mapSrc);
    this.context.drawImage(mapImage, 0, 0);

    if (this.devMode) {
      this.drawDevModeLayer();
    }
  };

  public stopFrameLoop = () => {
    clearInterval(this.frameLoop);
  };

  public mouseMoveListener = (ev: MouseEvent) => {
    this.mouse[0] = ev.x;
    this.mouse[1] = ev.y;
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

  public drawDevModeLayer = () => {
    this.drawGrid();
    this.drawSelector();

    this.context.strokeStyle = "red";
    this.context.strokeText("DEV MODE", 0, window.innerHeight);
  };

  public drawGrid = () => {
    const outline = this.imageLoader.getLoadedImage("/redoutline.png");
    const mapImage = this.imageLoader.getLoadedImage(this.mapObject.mapSrc);

    const numRows = Math.floor(mapImage.height / 10);
    const numCols = Math.floor((mapImage.width - 10) / 10);

    for (let r = 0; r < numRows; r++) {
      for (let c = 0; c < numCols; c++) {
        this.context.drawImage(outline, 10 * c, 10 * r + (c % 2) * 5);
      }
    }
  };

  public drawSelector = () => {
    const selectorImage = this.imageLoader.getLoadedImage("/selector.png");
    const snapPos = mousePosToSnapPos(...this.mouse);

    this.context.drawImage(selectorImage, snapPos[0] - 1, snapPos[1] - 1);
  };
}
