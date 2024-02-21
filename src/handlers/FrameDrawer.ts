import WorldManager from "./WorldManager";
import { isoToSnapPos, mousePosToSnapPos } from "../utils/gridConversions";

export default class FrameDrawer {
  constructor(public worldManager: WorldManager) {}

  public drawCurrentFrame = (fNum: number) => {
    const { imageLoader, mapObject, context, devMode, ben } = this.worldManager;

    const mapImage = imageLoader.getLoadedImage(mapObject.mapSrc);
    context.drawImage(mapImage, 0, 0);

    if (devMode) {
      this.drawDevModeLayer();
    }

    this.drawSelector();

    if (!ben) return;
    const [x, y] = isoToSnapPos(ben.r, ben.c);

    const shadowImage = imageLoader.getLoadedImage("/shadow.png");

    context.drawImage(
      shadowImage,
      0,
      0,
      shadowImage.width,
      shadowImage.height,
      x + ben.xOffset,
      y + ben.yOffset,
      shadowImage.width,
      shadowImage.height
    );

    context.drawImage(...ben.getDrawValues());
  };

  public drawDevModeLayer = () => {
    const { context } = this.worldManager;

    this.drawGrid();
    context.strokeStyle = "red";
    context.strokeText("DEV MODE", 0, window.innerHeight);
  };

  public drawGrid = () => {
    const { imageLoader, entityGrid, context, ben } = this.worldManager;
    const outline = imageLoader.getLoadedImage("/redoutline.png");
    const blueSelector = imageLoader.getLoadedImage("/blueselector.png");
    const yellowSelector = imageLoader.getLoadedImage("/yellowselector.png");

    entityGrid.forEach((cell) => {
      if (
        ben?.cellQueue.find(
          (benCell) =>
            benCell[0] === cell.getISO()[0] && benCell[1] === cell.getISO()[1]
        )
      ) {
        const [x, y] = cell.getXY();
        context.drawImage(yellowSelector, x - 1, y - 1);
      } else if (!cell.value) {
        context.drawImage(outline, ...cell.getXY());
      } else {
        const [x, y] = cell.getXY();
        context.drawImage(blueSelector, x - 1, y - 1);
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
