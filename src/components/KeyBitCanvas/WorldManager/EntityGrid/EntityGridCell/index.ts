import { MatrixCell } from "../../Cells";
import Entity from "../../Entity";

export default class EntityGridCell {
  public value: Entity | null = null;

  constructor(public matrixCell: MatrixCell) {}
}
