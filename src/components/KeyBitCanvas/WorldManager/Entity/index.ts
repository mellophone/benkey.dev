import EntityGrid from "../EntityGrid";
import ImageLoader from "../FrameHandler/ImageLoader";
import { IsoCell, XYCoord } from "../Cells";

export default class Entity {
  protected xOffset: number;
  protected yOffset: number;

  constructor(
    private name: string,
    protected textureName: string,
    protected currentCell: IsoCell,
    protected xiOffset = 0,
    protected yiOffset = 0,
    protected width = 16,
    protected height = 16,
    private collision = true
  ) {
    this.xOffset = xiOffset;
    this.yOffset = yiOffset;
  }

  public getCollision = (): boolean => {
    return this.collision;
  };

  public getCurrentCell = (): IsoCell => {
    return this.currentCell.getCopy();
  };

  public placeInGrid = (entityGrid: EntityGrid): void => {
    entityGrid.placeEntity(this, this.currentCell);
  };

  public drawEntity = (
    context: CanvasRenderingContext2D,
    imageLoader: ImageLoader,
    cameraOffset: XYCoord
  ): void => {
    const entityImage = imageLoader.getLoadedImage(this.textureName);
    const { x: mapX, y: mapY } = this.currentCell.toXYCoord();
    const { x: camX, y: camY } = cameraOffset;

    context.drawImage(
      entityImage,
      0,
      0,
      this.width,
      this.height,
      mapX + this.xOffset - camX,
      mapY + this.yOffset - camY,
      this.width,
      this.height
    );
  };
}
