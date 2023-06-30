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

  constructor() {}

  abstract drawImageWithOffset: (
    context: CanvasRenderingContext2D,
    pxOff: number,
    pyOff: number
  ) => void;
}
