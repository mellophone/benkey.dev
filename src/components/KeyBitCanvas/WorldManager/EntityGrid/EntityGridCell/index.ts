import { IsoCell, MatrixCell } from "../../Cells";
import Entity from "../../Entity";

export default class EntityGridCell {
  private entities: Entity[] = [];

  constructor(public matrixCell: MatrixCell) {}

  public removeEntity = (entity: Entity): void => {
    this.entities = this.entities.filter((e) => e !== entity);
  };

  public placeEntity = (entity: Entity): void => {
    this.removeEntity(entity);
    this.entities.push(entity);
  };

  public getEntities = (): Entity[] => {
    return [...this.entities];
  };

  public getCollision = (cell: IsoCell): boolean => {
    return !!this.entities.find((entity) => entity.getCollision(cell));
  };
}
