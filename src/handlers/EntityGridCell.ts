import { arrGridToIso, isoToSnapPos } from "../utils/gridConversions";

export default class EntityGridCell {
  public value = null;

  constructor(public i: number, public j: number) {}

  public getGridIndex = () => [this.i, this.j] as const;

  public getISO = () => arrGridToIso(this.i, this.j);

  public getXY = () => isoToSnapPos(...this.getISO());
}
