import { Texture } from "@/types/MapObject";
import Entity from "./Entity";

export default class StaticEntity extends Entity {
  private slices = [];

  constructor(
    private readonly img: HTMLImageElement,
    private readonly texture: Texture
  ) {
    super();
  }

  drawImageWithOffset = (
    context: CanvasRenderingContext2D,
    pxOff: number,
    pyOff: number
  ) => {
    // context.drawImage(...());
  };
}
