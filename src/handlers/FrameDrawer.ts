import WorldManager from "./WorldManager";

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
    const { x, y } = ben.currentCell.toXYCoord();

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
    const { context, canvas } = this.worldManager;

    this.drawGrid();

    const zoom = canvas.style.getPropertyValue("zoom");
    if (!zoom) throw Error("Cannot find zoom property on MapCanvas!");

    context.fillStyle = "red";
    context.font = "bold 20px courier";
    const text = "DEV MODE";
    const textWidth = context.measureText(text).width;
    context.fillText(
      text,
      window.innerWidth / parseInt(zoom) / 2 - textWidth / 2,
      window.innerHeight / parseInt(zoom)
    );
  };

  public drawGrid = () => {
    const { imageLoader, entityGrid, context, ben } = this.worldManager;
    const outline = imageLoader.getLoadedImage("/redoutline.png");
    const blueSelector = imageLoader.getLoadedImage("/blueselector.png");
    const yellowSelector = imageLoader.getLoadedImage("/yellowselector.png");

    entityGrid.forEach((cell) => {
      const { x, y } = cell.matrixCell.toXYCoord();

      if (ben?.cellQueue.find(cell.matrixCell.toIsoCell().equals)) {
        context.drawImage(yellowSelector, x - 1, y - 1);
      } else if (!cell.value) {
        context.drawImage(outline, x, y);
      } else {
        context.drawImage(blueSelector, x - 1, y - 1);
      }
    });
  };

  public drawSelector = () => {
    const { imageLoader, mouse, context, ben } = this.worldManager;
    const selectorImage = imageLoader.getLoadedImage("/selector.png");
    const mouseIso = mouse.toIsoCell();
    const snapMouse = mouseIso.toXYCoord();

    context.drawImage(selectorImage, snapMouse.x - 1, snapMouse.y - 1);

    const destination =
      ben?.cellQueue.at(-1) || (ben?.leavingCell && ben.currentCell);
    if (!destination) return;

    if (mouseIso.equals(destination)) return;

    const { x, y } = destination.toXYCoord();
    context.drawImage(selectorImage, x - 1, y - 1);
  };
}
