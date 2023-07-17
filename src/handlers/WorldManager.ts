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
  // private cameraManager = new CameraManager()

  constructor(private readonly mapObject: MapObject) {}

  public onStartup = (canvas: HTMLCanvasElement) => {
    this.imageLoader.onLoadingComplete = () => this.startWorld(canvas);
    this.imageLoader.startImageLoading(canvas);
  };

  public startWorld = (canvas: HTMLCanvasElement) => {
    const { renderer, imageLoader } = this;

    const imageCollection = imageLoader.getLoadedImages();
    renderer.addImagesToCollection(imageCollection);

    const worldLoop = setInterval(() => {
      // WORLD UPDATES
    }, hertzToMs(UPDATES_PER_SECOND));

    const frameLoop = setInterval(() => {
      renderer.render(canvas);
    }, hertzToMs(FRAMES_PER_SECOND));
  };
}
