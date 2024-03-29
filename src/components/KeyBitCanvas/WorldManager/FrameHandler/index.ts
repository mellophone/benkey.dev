import MapObject from "../../../../types/MapObject";
import Player from "../Entity/Player";
import EntityGrid from "../EntityGrid";
import ImageLoader from "./ImageLoader";
import Mover from "../Mover";
import { IsoCell, XYCoord } from "../Cells";

export default class FrameHandler {
  private cameraOffset = new XYCoord(0, 0);
  private cameraMover = new Mover("i", "j", "k", "l");
  private mouse = new XYCoord(-20, -20);
  private context: CanvasRenderingContext2D;
  private imageLoader = new ImageLoader(this.mapObject);
  private devMode = false;

  constructor(
    private canvas: HTMLCanvasElement,
    private mapObject: MapObject,
    private player: Player,
    private entityGrid: EntityGrid
  ) {
    const canvasContext = canvas.getContext("2d");
    if (!canvasContext) throw Error("Cannot retrieve 2d canvas context!");
    this.context = canvasContext;
  }

  public onImageLoadingComplete = (onCompleteCallback: () => void) => {
    this.imageLoader.onLoadingComplete = () => {
      onCompleteCallback();
      this.startListeners(this.entityGrid);
      this.resizeCanvas();
    };
  };

  public startImageLoading = (canvas: HTMLCanvasElement) => {
    this.imageLoader.startImageLoading(canvas);
  };

  public drawCurrentFrame = () => {
    this.updateCameraOffset();
    this.fillBlackBackground();

    const mapImage = this.imageLoader.getLoadedImage(this.mapObject.mapSrc);
    this.drawSimpleImage(mapImage, 0, 0);

    if (this.devMode) {
      this.drawDevModeLayer();
    }

    this.drawSelector();

    this.entityGrid.forEach((cell) => {
      cell.getEntities().forEach((entity) => {
        entity.drawEntity(
          this.context,
          this.imageLoader,
          this.cameraOffset,
          cell.matrixCell.toIsoCell()
        );
      });
    });
  };

  private fillBlackBackground = () => {
    this.context.fillStyle = "black";
    this.context.fillRect(0, 0, window.innerWidth, window.innerHeight);
  };

  private drawDevModeLayer = () => {
    this.drawGrid();

    this.drawWalkableArea();

    const { x, y } = this.cameraOffset;
    const text = `DEV MODE (${x}, ${y})`;

    this.fillText(
      text,
      0,
      this.getAdjustedWindowDimensions().h,
      "red",
      "bold 20px courier"
    );
  };

  private drawGrid = () => {
    const outline = this.imageLoader.getLoadedImage("/redoutline.png");
    const blueSelector = this.imageLoader.getLoadedImage("/blueselector.png");
    const yellowSelector = this.imageLoader.getLoadedImage(
      "/yellowselector.png"
    );

    this.entityGrid.forEach((cell) => {
      const { x, y } = cell.matrixCell.toXYCoord();
      const playerCellQueue = this.player.getMovementCellQueue();
      const isoCell = cell.matrixCell.toIsoCell();

      if (playerCellQueue.find(isoCell.equals)) {
        this.drawSimpleImage(yellowSelector, x - 1, y - 1);
      } else if (!cell.getEntities().length) {
        this.drawSimpleImage(outline, x, y);
      } else {
        this.drawSimpleImage(blueSelector, x - 1, y - 1);
      }
    });
  };

  private drawSelector = () => {
    const selectorImage = this.imageLoader.getLoadedImage("/selector.png");
    const mouseIso = this.mouse.toIsoCell();
    const snapMouse = mouseIso.toXYCoord();

    this.drawSimpleImage(selectorImage, snapMouse.x - 1, snapMouse.y - 1);
  };

  private updateCameraOffset = () => {
    if (this.devMode) {
      this.cameraOffset.x += this.cameraMover.getXMovement();
      this.cameraOffset.y += this.cameraMover.getYMovement();
      return;
    }

    const cell = this.player.getCurrentCell();
    const { x, y } = this.getDistanceFromSafeArea(cell);

    this.cameraOffset.x += x;
    this.cameraOffset.y += y;

    this.setSafeCameraOffset();
  };

  private drawSimpleImage = (
    image: CanvasImageSource,
    dx: number,
    dy: number
  ) => {
    const { x, y } = this.cameraOffset;

    this.context.drawImage(image, dx - x, dy - y);
  };

  private drawComplexImage = (
    image: CanvasImageSource,
    sx: number,
    sy: number,
    sw: number,
    sh: number,
    dx: number,
    dy: number,
    dw: number,
    dh: number
  ) => {
    const { x, y } = this.cameraOffset;

    this.context.drawImage(image, sx, sy, sw, sh, dx - x, dy - y, dw, dh);
  };

  private fillText = (
    text: string,
    dx: number,
    dy: number,
    color?: string,
    font?: string
  ) => {
    const { x, y } = this.cameraOffset;

    this.context.fillStyle = color ?? "black";
    this.context.font = font ?? this.context.font;

    this.context.fillText(text, dx - x, dy - y);
  };

  private getAdjustedWindowDimensions = () => {
    const zoom = this.getZoom();
    return {
      w: window.innerWidth / zoom,
      h: window.innerHeight / zoom,
    };
  };

  private drawWalkableArea = () => {
    this.context.strokeStyle = "red";
    this.context.lineWidth = 1;

    const { w, h } = this.getAdjustedWindowDimensions();

    this.context.strokeRect(w / 5, h / 5, (3 * w) / 5, (3 * h) / 5);
  };

  private getDistanceFromSafeArea = (cell: IsoCell): XYCoord => {
    const { x, y } = cell.toCenterXYCoord();
    const { w, h } = this.getAdjustedWindowDimensions();
    const { x: playerX, y: playerY } = this.player.getAnimationOffset();

    const screenX = x - this.cameraOffset.x + playerX;
    const screenY = y - this.cameraOffset.y + playerY;

    const leftLine = w / 5;
    const rightLine = (4 * w) / 5;
    const topLine = h / 5;
    const bottomLine = (4 * h) / 5;

    const leftDistance = screenX - leftLine;
    const rightDistance = screenX - rightLine;
    const topDistance = screenY - topLine;
    const bottomDistance = screenY - bottomLine;

    const xDistance = Math.round(
      screenX < leftLine
        ? leftDistance
        : screenX > rightLine
        ? rightDistance
        : 0
    );
    const yDistance = Math.round(
      screenY < topLine
        ? topDistance
        : screenY > bottomLine
        ? bottomDistance
        : 0
    );

    return new XYCoord(xDistance, yDistance);
  };

  private startListeners = (entityGrid: EntityGrid) => {
    this.startAutomaticResizing();
    this.canvas.onmousemove = this.mouseMoveListener;
    this.canvas.onkeydown = this.keyDownListener;
    this.canvas.onkeyup = this.keyUpListener;
    this.canvas.onmousedown = (ev) => this.mouseDownListener(ev, entityGrid);
  };

  private getZoom = () => {
    const zoom = this.canvas.style.getPropertyValue("zoom");
    if (!zoom) throw Error("Cannot find zoom property on MapCanvas!");

    return parseFloat(zoom);
  };

  private setZoom = (zoom: number) => {
    this.canvas.style.setProperty("zoom", `${zoom}`);
  };

  private getMapDimensions = () => {
    const mapImage = this.imageLoader.getLoadedImage(this.mapObject.mapSrc);
    if (!mapImage) return;

    const { naturalWidth, naturalHeight } = mapImage;

    return {
      mapWidth: naturalWidth,
      mapHeight: naturalHeight,
    };
  };

  private getMousePosition = (ev: MouseEvent) => {
    const { cameraOffset } = this;

    const zoom = this.getZoom();
    const x = ev.x / zoom + cameraOffset.x;
    const y = ev.y / zoom + cameraOffset.y;

    return new XYCoord(x, y);
  };

  private mouseMoveListener = (ev: MouseEvent) => {
    this.mouse = this.getMousePosition(ev);
  };

  private mouseDownListener = (ev: MouseEvent, entityGrid: EntityGrid) => {
    const mousePosition = this.getMousePosition(ev);
    const destination = mousePosition.toIsoCell();

    this.player.setDestination(destination, entityGrid);
  };

  private keyDownListener = (ev: KeyboardEvent) => {
    const key = ev.key.toLocaleLowerCase();

    this.player.setMoveState(key, true);
    this.cameraMover.updateMoverState(key, true);

    if (key === "`") this.devMode = !this.devMode;
  };

  private keyUpListener = (ev: KeyboardEvent) => {
    const key = ev.key.toLocaleLowerCase();

    this.player.setMoveState(key, false);
    this.cameraMover.updateMoverState(key, false);
  };

  private startAutomaticResizing = () => {
    this.resizeCanvas();
    window.onresize = this.resizeCanvas;
  };

  private resizeCanvas = () => {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    this.setDesiredZoom();
    this.focusCameraOnPlayer();
  };

  private getDesiredZoom = (): number => {
    const minDimension = Math.min(window.innerWidth, window.innerHeight);
    const desiredZoom = (8 * minDimension) / 900;

    return desiredZoom;
  };

  private setDesiredZoom = () => {
    const mapDimensions = this.getMapDimensions();
    if (!mapDimensions) return;

    const { mapWidth, mapHeight } = mapDimensions;

    const safeWidthZoom = window.innerWidth / mapWidth;
    const safeHeightZoom = window.innerHeight / mapHeight;
    const desiredZoom = this.getDesiredZoom();

    const safestZoom = Math.max(safeWidthZoom, safeHeightZoom, desiredZoom);

    this.setZoom(safestZoom);
  };

  private focusCameraOnPlayer = () => {
    const playerCell = this.player.getCurrentCell();
    const xyCoord = playerCell.toCenterXYCoord();
    this.focusCamera(xyCoord);
  };

  private focusCamera = (xyCoord: XYCoord) => {
    const { x, y } = xyCoord;
    const zoom = this.getZoom();

    const w = window.innerWidth / zoom;
    const h = window.innerHeight / zoom;

    this.cameraOffset.x = Math.round(x - w / 2);
    this.cameraOffset.y = Math.round(y - h / 2);

    this.setSafeCameraOffset();
  };

  private setSafeCameraOffset = () => {
    const mapDimensions = this.getMapDimensions();
    if (!mapDimensions) return;

    const { mapWidth, mapHeight } = mapDimensions;
    const { x, y } = this.cameraOffset;
    const zoom = this.getZoom();

    const xCap = Math.floor(mapWidth - window.innerWidth / zoom);
    const yCap = Math.floor(mapHeight - window.innerHeight / zoom);

    const safeX = Math.max(0, Math.min(x, xCap));
    const safeY = Math.max(0, Math.min(y, yCap));

    this.cameraOffset.x = safeX;
    this.cameraOffset.y = safeY;
  };
}
