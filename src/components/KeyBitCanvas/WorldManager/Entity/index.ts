import EntityGrid from "../EntityGrid";
import ImageLoader from "../FrameHandler/ImageLoader";
import EntityCell from "./EntityCell";
import { CELL_WIDTH, IsoCell, XYCoord } from "../Cells";

export default class Entity {
  protected xOffset: number;
  protected yOffset: number;

  constructor(
    private name: string,
    protected textureName: string,
    protected currentCells: EntityCell[],
    protected width: number,
    protected height: number,
    protected xiOffset: number,
    protected yiOffset: number,
    private collision = true
  ) {
    this.xOffset = xiOffset;
    this.yOffset = yiOffset;
  }

  public getCollision = (cell: IsoCell): boolean => {
    return (
      this.collision &&
      !!this.currentCells.find((ec) => ec.cell.equals(cell))?.collision
    );
  };

  public placeInGrid = (entityGrid: EntityGrid): void => {
    this.currentCells.forEach((ec) => entityGrid.placeEntity(this, ec.cell));
  };

  public drawEntity = (
    context: CanvasRenderingContext2D,
    imageLoader: ImageLoader,
    cameraOffset: XYCoord,
    renderCell: IsoCell
  ): void => {
    if (
      !this.currentCells
        .filter((cell) => cell.render)
        .find((rc) => rc.cell.equals(renderCell))
    )
      return;

    const entityImage = imageLoader.getLoadedImage(this.textureName);
    const { x: mapX, y: mapY } = renderCell.toXYCoord();
    const { x: camX, y: camY } = cameraOffset;

    const drawHalf = !!this.currentCells
      .filter((cc) => cc.render)
      .find((ec) => ec.cell.r + ec.cell.c === renderCell.r + renderCell.c + 1);

    const isSkinny = entityImage.width < CELL_WIDTH;
    const drawWidth = isSkinny
      ? entityImage.width
      : drawHalf
      ? CELL_WIDTH / 2
      : CELL_WIDTH;

    context.drawImage(
      entityImage,
      (isSkinny ? this.xOffset : mapX) - this.xOffset,
      0,
      drawWidth,
      entityImage.height,
      (isSkinny ? this.xOffset : mapX) - camX,
      this.yOffset - camY,
      drawWidth,
      entityImage.height
    );
  };

  public getEntityCellProperties = (cell: IsoCell) => {};

  // public drawEntity = (
  //   context: CanvasRenderingContext2D,
  //   imageLoader: ImageLoader,
  //   cameraOffset: XYCoord
  // ): void => {
  //   this.renderCells.forEach((renderCell) => {
  //     const entityImage = imageLoader.getLoadedImage(this.textureName);
  //     const { x: mapX, y: mapY } = renderCell.toXYCoord();
  //     const { x: camX, y: camY } = cameraOffset;

  //     context.drawImage(
  //       entityImage,
  //       mapX - this.xOffset,
  //       0,
  //       CELL_WIDTH,
  //       this.height,
  //       this.xOffset - camX + mapX - this.xOffset,
  //       this.yOffset - camY,
  //       CELL_WIDTH,
  //       this.height
  //     );
  //   });
  // };
}
