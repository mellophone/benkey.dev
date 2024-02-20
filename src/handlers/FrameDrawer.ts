import WorldManager from "./WorldManager";
import { isoToSnapPos, mousePosToSnapPos } from "../utils/gridConversions";

export default class FrameDrawer {
  constructor(public worldManager: WorldManager) {}

  public drawCurrentFrame = (fNum: number) => {
    const { imageLoader, mapObject, context, devMode, entityGrid } =
      this.worldManager;

    const mapImage = imageLoader.getLoadedImage(mapObject.mapSrc);
    context.drawImage(mapImage, 0, 0);

    if (devMode) {
      this.drawDevModeLayer();
    }

    this.drawSelector();

    entityGrid.forEach((cell) => {
      const entity = cell.value;
      if (!entity) return;

      const [x, y] = cell.getXY();

      const shadowImage = imageLoader.getLoadedImage("/shadow.png");

      context.drawImage(
        shadowImage,
        0,
        0,
        shadowImage.width,
        shadowImage.height,
        x + entity.xOffset,
        y + entity.yOffset,
        shadowImage.width,
        shadowImage.height
      );

      context.drawImage(...entity.getDrawValues());
    });
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
    const selector = imageLoader.getLoadedImage("/blueselector.png");

    entityGrid.forEach((cell) => {
      if (!cell.value) {
        context.drawImage(outline, ...cell.getXY());
      } else {
        const [x, y] = cell.getXY();
        context.drawImage(selector, x - 1, y - 1);
      }
    });
  };

  public drawSelector = () => {
    const { imageLoader, mouse, context } = this.worldManager;
    const selectorImage = imageLoader.getLoadedImage("/selector.png");
    const snapPos = mousePosToSnapPos(...mouse);

    context.drawImage(selectorImage, snapPos[0] - 1, snapPos[1] - 1);
  };
}
