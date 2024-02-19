import WorldManager from "./WorldManager";
import { mousePosToSnapPos } from "../utils/gridConversions";

export default class FrameDrawer {
  constructor(public worldManager: WorldManager) {}

  public drawCurrentFrame = () => {
    const { imageLoader, mapObject, context, devMode } = this.worldManager;

    const mapImage = imageLoader.getLoadedImage(mapObject.mapSrc);
    context.drawImage(mapImage, 0, 0);

    if (devMode) {
      this.drawDevModeLayer();
    }

    this.drawSelector();
  };

  public drawDevModeLayer = () => {
    const { context } = this.worldManager;

    this.drawGrid();
    context.strokeStyle = "red";
    context.strokeText("DEV MODE", 0, window.innerHeight);
  };

  public drawGrid = () => {
    const { imageLoader, entityGrid, context } = this.worldManager;
    const outline = imageLoader.getLoadedImage("/redoutline.png");

    entityGrid.forEach((cell) => {
      context.drawImage(outline, ...cell.getXY());
    });
  };

  public drawSelector = () => {
    const { imageLoader, mouse, context } = this.worldManager;
    const selectorImage = imageLoader.getLoadedImage("/selector.png");
    const snapPos = mousePosToSnapPos(...mouse);

    context.drawImage(selectorImage, snapPos[0] - 1, snapPos[1] - 1);
  };
}
