import { Texture } from "@/types/MapObject";
import Entity from "./Entity";
import { RenderObject } from "../types/RenderObject";

export default class StaticEntity extends Entity {
  private slices = [];

  constructor(
    private readonly img: HTMLImageElement,
    private readonly texture: Texture
  ) {
    super();
  }

  getRenderObjects = (): RenderObject[] => {
    return [];
  };
}
