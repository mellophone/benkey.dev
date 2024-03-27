import Entity from "..";
import WorldManager from "../..";
import { IsoCell } from "../../../../../types/Cell";

export default class Player extends Entity {
  constructor(worldManager: WorldManager) {
    super(worldManager, "ben", "/ben0.png", new IsoCell(1, -1), 2, -10);
  }
}
