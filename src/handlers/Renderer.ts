import { ImageCollection } from "@/types/ImageData";
import { MapObject } from "@/types/MapObject";

export default class Renderer {
  private imageCollection: ImageCollection = {};
  private canvas: HTMLCanvasElement | undefined;
  private context: CanvasRenderingContext2D | undefined;

  constructor(private readonly mapObject: MapObject) {}

  public setCanvas = (canvas: HTMLCanvasElement) => {
    this.canvas = canvas;
    const context = canvas.getContext("2d");
    if (context) this.context = context;
  };

  public render = (canvas: HTMLCanvasElement) => {
    if (!this.context) return;

    const mapImg = this.imageCollection[this.mapObject.mapSrc];

    if (!mapImg) {
      throw new Error("Map src not found!");
    }

    this.context.drawImage(mapImg, 0, 0);
  };

  public addImagesToCollection = (additionalCollection: ImageCollection) => {
    this.imageCollection = {
      ...this.imageCollection,
      ...additionalCollection,
    };
  };

  public getContext = () => this.context;
}
