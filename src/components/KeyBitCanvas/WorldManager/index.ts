import EntityGrid from "./EntityGrid";
import FrameHandler from "./FrameHandler";
import MapObject from "@/types/MapObject";
import Player from "./Entity/Player";
import { IsoCell } from "./Cells";
import Entity from "./Entity";
import EntityCell from "./Entity/EntityCell";

export default class WorldManager {
  private static UPDATES_PER_SECOND = 40;
  private static FRAMES_PER_SECOND = 60;

  private player = new Player(new IsoCell(1, -1));
  private entityGrid = new EntityGrid();
  private frameHandler = new FrameHandler(
    this.canvas,
    this.mapObject,
    this.player,
    this.entityGrid
  );

  private worldLoop?: NodeJS.Timer;
  private frameLoop?: NodeJS.Timer;

  constructor(
    private canvas: HTMLCanvasElement,
    private readonly mapObject: MapObject
  ) {
    this.frameHandler.onImageLoadingComplete(this.startWorld);
    this.frameHandler.startImageLoading(canvas);
  }

  private startWorld = () => {
    this.entityGrid.resetGrid(this.mapObject);
    this.startWorldLoop();
    this.startFrameLoop();
    this.player.placeInGrid(this.entityGrid);

    this.mapObject.textures
      .map((texture) => {
        const cells: EntityCell[] = [];

        texture.filledCells.forEach((filledCell) => {
          const [r, c] = filledCell;
          const cell = new IsoCell(r, c);
          cells.push(new EntityCell(cell, true, false));
        });

        texture.renderCells.forEach((renderCell) => {
          const [r, c] = renderCell;
          const cell = new IsoCell(r, c);
          const foundCell = cells.find((ec) => ec.cell.equals(cell));
          if (foundCell) {
            foundCell.render = true;
          } else {
            cells.push(new EntityCell(cell, false, true));
          }
        });

        texture.interactiveCells.forEach((interactiveCell) => {
          const [r, c] = interactiveCell.cell;
          const cell = new IsoCell(r, c);
          const foundCell = cells.find((ec) => ec.cell.equals(cell));
          if (foundCell) {
            foundCell.interaction = interactiveCell.interaction;
          } else {
            cells.push(
              new EntityCell(cell, false, false, interactiveCell.interaction)
            );
          }
        });

        return new Entity(
          texture.src,
          texture.src,
          cells,
          150,
          114,
          texture.pxOff,
          texture.pyOff
        );
      })
      .forEach((entity) => {
        entity.placeInGrid(this.entityGrid);
      });
  };

  private startWorldLoop = () => {
    let tNum = 0;
    this.worldLoop = setInterval(() => {
      this.manageWorldUpdates(tNum);
      tNum++;
    }, WorldManager.hertzToMs(WorldManager.UPDATES_PER_SECOND));
  };

  private manageWorldUpdates = (tNum: number) => {
    this.player.think(tNum, this.entityGrid);
  };

  private stopWorldLoop = () => {
    clearInterval(this.worldLoop);
  };

  private startFrameLoop = () => {
    let fNum = 0;
    this.frameLoop = setInterval(() => {
      this.frameHandler.drawCurrentFrame();
      fNum++;
    }, WorldManager.hertzToMs(WorldManager.FRAMES_PER_SECOND));
  };

  private stopFrameLoop = () => {
    clearInterval(this.frameLoop);
  };

  private static hertzToMs = (hertz: number): number => {
    return 1000 / hertz;
  };
}
