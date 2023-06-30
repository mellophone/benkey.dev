import { MapObject } from "@/types/MapObject";

export default class ImageLoader {
  private defaultSrcList = ["/ben0.png", "/selector.png", "/shadow.png"];
  private fullSrcList: string[];
  private currentlyLoading: number = 0;

  constructor(private readonly mapObject: MapObject) {
    const mapSrc = mapObject.mapSrc;
    const mapTextureSrcList = mapObject.textures.map((texture) => texture.src);
    this.fullSrcList = [mapSrc, ...mapTextureSrcList, ...this.defaultSrcList];
  }

  public startImageLoading = (canvas: HTMLCanvasElement) => {
    let {
      currentlyLoading,
      fullSrcList,
      createImageElement,
      onLoadingComplete,
    } = this;

    currentlyLoading += fullSrcList.length;
    fullSrcList.forEach((src) => {
      const img = createImageElement(src);
      canvas.appendChild(img);
      img.onload = () => {
        currentlyLoading--;
        currentlyLoading === 0 && onLoadingComplete();
        img.onload = null;
      };
    });
  };

  public getCurrentlyLoading = () => this.currentlyLoading;

  public onLoadingComplete: () => any = () => {};

  private createImageElement = (src: string) => {
    const img = document.createElement("img");
    img.src = src;
    img.style.display = "none";
    return img;
  };
}
