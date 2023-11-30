import { MapObject } from "@/types/MapObject";
import Renderer from "./Renderer";
import ImageLoader from "./ImageLoader";
import CameraManager from "./CameraManager";

const UPDATES_PER_SECOND = 40;
const FRAMES_PER_SECOND = 60;
const hertzToMs = (hertz: number) => 1000 / hertz;

export default class WorldManager {
  private renderer = new Renderer(this.mapObject);
  private imageLoader = new ImageLoader(this.mapObject);
  private cameraManager = new CameraManager();

  constructor(private readonly mapObject: MapObject) {}

  public onStartup = (canvas: HTMLCanvasElement) => {
    this.imageLoader.onLoadingComplete = () => this.startWorld(canvas);
    this.imageLoader.startImageLoading(canvas);
  };

  public startWorld = (canvas: HTMLCanvasElement) => {
    this.cameraManager.setCanvas(canvas);
    this.renderer.setCanvas(canvas);

    const imageCollection = this.imageLoader.getLoadedImages();
    this.renderer.addImagesToCollection(imageCollection);

    const worldLoop = setInterval(() => {
      // WORLD UPDATES
    }, hertzToMs(UPDATES_PER_SECOND));

    const frameLoop = setInterval(() => {
      this.cameraManager.focus();
      this.renderer.render(canvas);

      const context = this.renderer.getContext();

      if (!context) return;

      const center = this.cameraManager.getCenter();
      context.fillStyle = "#ff0000";
      context.fillRect(center[0] - 1, center[1] - 1, 2, 2);
    }, hertzToMs(FRAMES_PER_SECOND));
  };
}
