import WorldManager from "./WorldManager";

export default class FrameDrawer {
  constructor(public worldManager: WorldManager) {}

  public drawCurrentFrame = (fNum: number) => {
    const { imageLoader, mapObject, cameraHandler, devMode, ben } =
      this.worldManager;

    cameraHandler.updateCamera();

    const mapImage = imageLoader.getLoadedImage(mapObject.mapSrc);
    cameraHandler.drawSimpleImage(mapImage, 0, 0);

    if (devMode) {
      this.drawDevModeLayer();
    }

    this.drawSelector();

    if (!ben) return;
    const { x, y } = ben.currentCell.toXYCoord();

    const shadowImage = imageLoader.getLoadedImage("/shadow.png");

    cameraHandler.drawComplexImage(
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

    cameraHandler.drawComplexImage(...ben.getDrawValues());
  };

  public drawDevModeLayer = () => {
    const { cameraHandler } = this.worldManager;

    this.drawGrid();

    cameraHandler.drawWalkableArea();

    const zoom = cameraHandler.getZoom();

    const { x, y } = cameraHandler.cameraOffset;
    const text = `DEV MODE (${x}, ${y})`;

    cameraHandler.fillText(
      text,
      0,
      cameraHandler.getAdjustedWindowDimensions().h,
      "red",
      "bold 20px courier"
    );
  };

  public drawGrid = () => {
    const { imageLoader, entityGrid, cameraHandler, ben } = this.worldManager;
    const outline = imageLoader.getLoadedImage("/redoutline.png");
    const blueSelector = imageLoader.getLoadedImage("/blueselector.png");
    const yellowSelector = imageLoader.getLoadedImage("/yellowselector.png");

    entityGrid.forEach((cell) => {
      const { x, y } = cell.matrixCell.toXYCoord();

      if (ben?.cellQueue.find(cell.matrixCell.toIsoCell().equals)) {
        cameraHandler.drawSimpleImage(yellowSelector, x - 1, y - 1);
      } else if (!cell.value) {
        cameraHandler.drawSimpleImage(outline, x, y);
      } else {
        cameraHandler.drawSimpleImage(blueSelector, x - 1, y - 1);
      }
    });
  };

  public drawSelector = () => {
    const {
      imageLoader,
      cameraHandler,
      cameraHandler: { mouse },
      ben,
    } = this.worldManager;

    const selectorImage = imageLoader.getLoadedImage("/selector.png");
    const mouseIso = mouse.toIsoCell();
    const snapMouse = mouseIso.toXYCoord();

    cameraHandler.drawSimpleImage(
      selectorImage,
      snapMouse.x - 1,
      snapMouse.y - 1
    );

    const destination =
      ben?.cellQueue.at(-1) || (ben?.leavingCell && ben.currentCell);
    if (!destination) return;

    if (mouseIso.equals(destination)) return;

    const { x, y } = destination.toXYCoord();
    cameraHandler.drawSimpleImage(selectorImage, x - 1, y - 1);
  };
}
