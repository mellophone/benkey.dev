import { getX, getY } from "../utils/gridConversions";

export default class Entity {
  constructor(
    public name: string,
    public texture: HTMLImageElement,
    public r: number,
    public c: number,
    public xOffset = 0,
    public yOffset = 0,
    public w = 16,
    public h = 16
  ) {}

  public getDrawValues = () =>
    [
      this.texture,
      0,
      0,
      this.w,
      this.h,
      getX(this.r, this.c) + this.xOffset,
      getY(this.r, this.c) + this.yOffset,
      this.w,
      this.h,
    ] as const;
}
