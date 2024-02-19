import { MapObject } from "@/types/MapObject";
import ImageLoader from "./ImageLoader";
import { mousePosToSnapPos } from "../utils/gridConversions";

const UPDATES_PER_SECOND = 40;
const FRAMES_PER_SECOND = 60;
const hertzToMs = (hertz: number) => 1000 / hertz;

export default class WorldManager {
  public context: CanvasRenderingContext2D;
  public imageLoader = new ImageLoader(this.mapObject);
  private devMode = false;

  constructor(
    public canvas: HTMLCanvasElement,
    public readonly mapObject: MapObject
  ) {
    const canvasContext = canvas.getContext("2d");
    if (!canvasContext) throw Error("Cannot retrieve 2d canvas context!");
    this.context = canvasContext;

    this.imageLoader.onLoadingComplete = this.startWorld;
    this.imageLoader.startImageLoading(canvas);
  }

  public startWorld = () => {
    this.startAutomaticResizing();

    const imageCollection = this.imageLoader.getLoadedImages();
    const mapImage = imageCollection[this.mapObject.mapSrc];
    let mouse: [number, number] = [-1, -1];
    this.canvas.onmousemove = (ev) => {
      mouse[0] = ev.x;
      mouse[1] = ev.y;
    };

    this.canvas.onkeydown = (ev) => {
      if (ev.key.toLocaleLowerCase() === "`") {
        this.devMode = !this.devMode;
      }
    };

    /**
     * Loop for all mechanical world updates
     */
    const worldLoop = setInterval(() => {}, hertzToMs(UPDATES_PER_SECOND));

    /**
     * Loop for all visual frame updates
     */
    const frameLoop = setInterval(() => {
      this.context.drawImage(mapImage, 0, 0);

      if (this.devMode) {
        this.drawDevModeLayer(this.context, mapImage, mouse);
      }
    }, hertzToMs(FRAMES_PER_SECOND));
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

  public drawDevModeLayer = (
    context: CanvasRenderingContext2D,
    map: HTMLImageElement,
    mouse: [number, number]
  ) => {
    this.drawGrid(context, map);
    this.drawSelector(context, mouse);

    context.strokeStyle = "red";
    context.strokeText("DEV MODE", 0, window.innerHeight);
  };

  public drawGrid = (
    context: CanvasRenderingContext2D,
    map: HTMLImageElement
  ) => {
    const outline = this.imageLoader.getLoadedImages()["/redoutline.png"];

    const numRows = Math.floor(map.height / 10);
    const numCols = Math.floor((map.width - 10) / 10);

    for (let r = 0; r < numRows; r++) {
      for (let c = 0; c < numCols; c++) {
        context.drawImage(outline, 10 * c, 10 * r + (c % 2) * 5);
      }
    }
  };

  public drawSelector = (
    context: CanvasRenderingContext2D,
    mouse: [number, number]
  ) => {
    const selectorImage = this.imageLoader.getLoadedImages()["/selector.png"];

    const snapPos = mousePosToSnapPos(mouse[0], mouse[1]);

    context.drawImage(selectorImage, snapPos[0] - 1, snapPos[1] - 1);
  };
}
