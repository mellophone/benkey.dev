import { isoToSnapPos } from "@/components/gridConversions";
import { EntityProps, RenderObjectProps } from "./types";
import RenderObject from "./RenderObject";

class Entity {
  private entityProps: EntityProps;
  private renderObjects: RenderObject[];

  constructor(entityProps: EntityProps) {
    this.entityProps = entityProps;
    const { img, texture, priority } = entityProps;
    const { renderCells, pxOff, pyOff } = texture;

    this.renderObjects = renderCells.map(
      (renderCell) =>
        new RenderObject({
          img,
          pxOff,
          pyOff,
          renderCell,
          priority,
        })
    );
  }

  getRenderObjects = () => this.renderObjects;
}

export default Entity;
