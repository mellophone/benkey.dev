import { ImageCollection } from "@/types/ImageData";
import { MapObject } from "@/types/MapObject";

export default class Renderer {
  private imageCollection: ImageCollection = {};

  constructor(private readonly mapObject: MapObject) {}

  public render = (canvas: HTMLCanvasElement) => {
    const { imageCollection, mapObject } = this;

    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas context cannot be retrieved.");

    const mapImg = imageCollection[mapObject.mapSrc];

    if (!mapImg) {
      throw new Error("Map src not found!");
    }

    context.drawImage(mapImg, 0, 0);
  };

  public addImagesToCollection = (additionalCollection: ImageCollection) => {
    this.imageCollection = {
      ...this.imageCollection,
      ...additionalCollection,
    };
  };
}
