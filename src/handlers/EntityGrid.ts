import EntityGridCell from "./EntityGridCell";
import WorldManager from "./WorldManager";

export default class EntityGrid {
  public grid: EntityGridCell[][] = [];

  constructor(public worldManager: WorldManager) {}

  public resetGrid = () => {
    const { imageLoader, mapObject } = this.worldManager;

    const mapImage = imageLoader.getLoadedImage(mapObject.mapSrc);
    const numRows = Math.floor((mapImage.height - 4) / 5);
    const numCols = Math.floor((mapImage.width - 10) / 20);

    this.grid = [];

    for (let i = 0; i < numRows; i++) {
      const iRow: EntityGridCell[] = [];
      for (let j = 0; j < numCols; j++) {
        iRow.push(new EntityGridCell(i, j));
      }
      this.grid.push(iRow);
    }
  };

  public forEach = (callback: (cell: EntityGridCell) => void) => {
    this.grid.forEach((iRow) => iRow.forEach((cell) => callback(cell)));
  };
}
