import { RenderObject } from "../types/RenderObject";
import { StaticTexture } from "../types/Texture";
import { CELL_WIDTH } from "../utils/constants";
import { isoToSnapPos } from "../utils/gridConversions";
import Entity from "./Entity";

export default class StaticEntity extends Entity {
  constructor(private texture: StaticTexture, private image: HTMLImageElement) {
    super();
  }

  public getRenderObjects = (): RenderObject[] => {
    const { filledCells, pxOff, pyOff } = this.texture;

    filledCells.forEach((filledCell) => {
      const [cellX, cellY] = isoToSnapPos(...filledCell);

      const sx = cellX - pxOff;
      const sy = 0;

      const sw = CELL_WIDTH;
      const sh = this.image.naturalHeight;

      const dx = pxOff;
      const dy = pyOff;

      const dw = sw;
      const dh = sh;

      const z = cellY;
    });

    return [];
  };
}
