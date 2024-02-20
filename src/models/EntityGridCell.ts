import { arrGridToIso, isoToSnapPos } from "../utils/gridConversions";
import Entity from "./Entity";

export default class EntityGridCell {
  public value: Entity | null = null;

  constructor(public i: number, public j: number) {}

  public getGridIndex = () => [this.i, this.j] as const;

  public getISO = () => arrGridToIso(this.i, this.j);

  public getXY = () => isoToSnapPos(...this.getISO());
}
