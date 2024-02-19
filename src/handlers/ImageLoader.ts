import { ImageCollection } from "@/types/ImageData";
import { MapObject } from "@/types/MapObject";

export default class ImageLoader {
  private currentlyLoading: number;
  private defaultSrcList = [
    "/ben0.png",
    "/selector.png",
    "/shadow.png",
    "/redoutline.png",
  ];

  private fullSrcList: string[];
  private loadedImageCollection: ImageCollection = {};

  constructor(private readonly mapObject: MapObject) {
    const mapSrc = mapObject.mapSrc;
    const mapTextureSrcList = mapObject.textures.map((texture) => texture.src);

    this.fullSrcList = [mapSrc, ...mapTextureSrcList, ...this.defaultSrcList];
    this.currentlyLoading = this.fullSrcList.length;
  }

  public startImageLoading = (canvas: HTMLCanvasElement) => {
    let { currentlyLoading, fullSrcList, loadImageIfUnique } = this;

    fullSrcList.forEach((src) => loadImageIfUnique(src, canvas));
  };

  public loadImageIfUnique = (src: string, canvas: HTMLCanvasElement) => {
    let {
      loadedImageCollection,
      markImageLoaded,
      getCurrentlyLoading,
      createImageElement,
      onLoadingComplete,
    } = this;

    const alreadyLoading = loadedImageCollection[src];

    if (alreadyLoading) {
      markImageLoaded();
      return;
    }

    const img = createImageElement(src);
    loadedImageCollection[src] = img;
    canvas.appendChild(img);

    img.onload = () => {
      markImageLoaded();
      if (!getCurrentlyLoading()) {
        onLoadingComplete();
      }
      img.onload = null;
    };
  };

  public getCurrentlyLoading = () => this.currentlyLoading;

  public onLoadingComplete: () => any = () => {};

  public getLoadedImages = () => this.loadedImageCollection;

  public getLoadedImage = (filename: string) =>
    this.loadedImageCollection[filename];

  private markImageLoaded = () => this.currentlyLoading--;

  private createImageElement = (src: string) => {
    const img = document.createElement("img");
    img.src = src;
    img.style.display = "none";
    return img;
  };
}
