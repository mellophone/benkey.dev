import { MapObject } from "@/types/MapObject";
import EntityRenderer from "./EntityRenderer";

const UPDATES_PER_SECOND = 40;
const FRAMES_PER_SECOND = 60;
const hertzToMs = (hertz: number) => 1000 / hertz;

export default class WorldManager {
  private entityRenderer = new EntityRenderer();
  private entities = [];
  constructor(private readonly mapObject: MapObject) {}

  public startWorld = (canvas: HTMLCanvasElement) => {
    const worldLoop = setInterval(() => {
      // WORLD UPDATES
    }, hertzToMs(UPDATES_PER_SECOND));

    const frameLoop = setInterval(() => {
      this.entityRenderer;
    }, hertzToMs(FRAMES_PER_SECOND));
  };
}
