import { RenderObject } from "../types/RenderObject";

export default abstract class Entity {
  /**
   * stores:
   *    pxOff
   *    pyOff
   *    frameDetails (if animated)
   *    cellLocation
   *    grid
   *
   * basically:
   *    only info in relation to the grid (not the screen)
   */

  abstract getRenderObjects: () => RenderObject[];
}
