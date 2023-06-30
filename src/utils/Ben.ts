import { isoToSnapPos } from "@/components/gridConversions";
import CollisionGrid from "./CollisionGrid";
import RenderObject from "./RenderObject";
import { Direction, Iso, SpriteProps } from "./types";
import { CELL_WIDTH, SPRITE_HEIGHT, SPRITE_WIDTH } from "./constants";

class Ben {
  private grid: CollisionGrid;
  private benImg: HTMLImageElement;
  private cell: Iso;

  private ixOff = 0;
  private iyOff = 0;

  private renderObjects: RenderObject[] = [];
  private direction: Direction = "SE";

  constructor(benProps: SpriteProps) {
    const { grid, img, isoInit } = benProps;
    this.grid = grid;
    this.benImg = img;
    this.cell = isoInit;
    this.grid.fillCell(isoInit);
    this.grid.setCellInteraction(isoInit, "ben");

    const [x, y] = isoToSnapPos(...isoInit);

    const initRenderObject = new RenderObject(
      {
        img,
        pxOff: x + CELL_WIDTH / 2 - SPRITE_WIDTH / 2,
        pyOff: y - 10,
        renderCell: isoInit,
      },
      {
        frameHeight: SPRITE_HEIGHT,
        frameWidth: SPRITE_WIDTH,
        frameX: 0,
        frameY: 0,
      }
    );

    this.renderObjects.push(initRenderObject);
  }

  setDirection = (newDirection: Direction) => (this.direction = newDirection);

  getRenderObjects = () => this.renderObjects;

  getXY = () => {
    const snapPos = isoToSnapPos(...this.cell);
    snapPos[0] += CELL_WIDTH / 2 + this.ixOff;
    snapPos[1] += -10 + SPRITE_HEIGHT / 2 + this.iyOff;
    return snapPos;
  };

  getIso = () => this.cell;
}

export default Ben;
