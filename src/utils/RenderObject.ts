import { isoToSnapPos } from "@/components/gridConversions";
import { CanvasImageParams, FrameSpecs, RenderObjectProps } from "./types";
import { CELL_WIDTH } from "./constants";

class RenderObject {
  private canvasImageParams: CanvasImageParams;
  private zIndex: number;

  constructor(renderObjectProps: RenderObjectProps, frameSpecs?: FrameSpecs) {
    const { img, pxOff, pyOff, renderCell, priority } = renderObjectProps;
    const [r, c] = renderCell;
    const [x, y] = isoToSnapPos(r, c);

    if (frameSpecs) {
      const { frameHeight, frameWidth, frameX, frameY } = frameSpecs;
      const sx = x - pxOff + frameX;
      const sy = 0 + frameY;
      const sw = frameWidth;
      const sh = frameHeight;
      const dx = x;
      const dy = pyOff;
      const dw = frameWidth;
      const dh = frameHeight;
      this.canvasImageParams = [img, sx, sy, sw, sh, dx, dy, dw, dh];
    } else {
      const sx = x - pxOff;
      const sy = 0;
      const sw = CELL_WIDTH;
      const sh = img.naturalHeight;
      const dx = x;
      const dy = pyOff;
      const dw = CELL_WIDTH;
      const dh = img.naturalHeight;
      this.canvasImageParams = [img, sx, sy, sw, sh, dx, dy, dw, dh];
    }

    const zPush = priority === undefined ? 0 : 1 - 1 / 2 ** (priority + 1);
    this.zIndex = y + zPush;
  }

  getZIndex = () => this.zIndex;

  getCanvasImageParams = () => this.canvasImageParams;
}

export default RenderObject;
