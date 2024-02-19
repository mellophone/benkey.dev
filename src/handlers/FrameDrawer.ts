import { mousePosToSnapPos } from "../utils/gridConversions";
import WorldManager from "./WorldManager";

export default class FrameDrawer {
  constructor(public worldManager: WorldManager) {}

  public drawCurrentFrame = () => {
    const mapImage = this.worldManager.imageLoader.getLoadedImage(
      this.worldManager.mapObject.mapSrc
    );
    this.worldManager.context.drawImage(mapImage, 0, 0);

    if (this.worldManager.devMode) {
      this.drawDevModeLayer();
    }

    this.drawSelector();
  };

  public drawDevModeLayer = () => {
    this.drawGrid();

    this.worldManager.context.strokeStyle = "red";
    this.worldManager.context.strokeText("DEV MODE", 0, window.innerHeight);
  };

  public drawGrid = () => {
    const outline =
      this.worldManager.imageLoader.getLoadedImage("/redoutline.png");
    const mapImage = this.worldManager.imageLoader.getLoadedImage(
      this.worldManager.mapObject.mapSrc
    );

    const numRows = Math.floor(mapImage.height / 10);
    const numCols = Math.floor((mapImage.width - 10) / 10);

    for (let r = 0; r < numRows; r++) {
      for (let c = 0; c < numCols; c++) {
        this.worldManager.context.drawImage(
          outline,
          10 * c,
          10 * r + (c % 2) * 5
        );
      }
    }
  };

  public drawSelector = () => {
    const selectorImage =
      this.worldManager.imageLoader.getLoadedImage("/selector.png");
    const snapPos = mousePosToSnapPos(...this.worldManager.mouse);

    this.worldManager.context.drawImage(
      selectorImage,
      snapPos[0] - 1,
      snapPos[1] - 1
    );
  };
}
