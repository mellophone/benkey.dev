import WorldManager from "..";
import { XYCoord } from "../../../../types/Cell";
import MapObject from "../../../../types/MapObject";
import Player from "../Entity/Player";
import EntityGrid from "../EntityGrid";
import ImageLoader from "./ImageLoader";

export default class FrameHandler {
  public cameraOffset = new XYCoord(0, 0);
  public cameraMovementKeys = {
    i: false,
    j: false,
    k: false,
    l: false,
  };
  public mouse = new XYCoord(-20, -20);
  private context: CanvasRenderingContext2D;
  private imageLoader = new ImageLoader(this.mapObject);

  constructor(
    public worldManager: WorldManager,
    private player: Player,
    private mapObject: MapObject
  ) {
    const canvasContext = worldManager.canvas.getContext("2d");
    if (!canvasContext) throw Error("Cannot retrieve 2d canvas context!");
    this.context = canvasContext;
  }

  public onImageLoadingComplete = (onCompleteCallback: () => void) => {
    this.imageLoader.onLoadingComplete = onCompleteCallback;
  };

  public startImageLoading = (canvas: HTMLCanvasElement) => {
    this.imageLoader.startImageLoading(canvas);
  };

  public temporaryStart = (entityGrid: EntityGrid) => {
    this.startListeners(entityGrid);
  };

  public drawCurrentFrame = (entityGrid: EntityGrid) => {
    const { devMode } = this.worldManager;

    this.updateCamera();

    const mapImage = this.imageLoader.getLoadedImage(this.mapObject.mapSrc);
    this.drawSimpleImage(mapImage, 0, 0);

    if (devMode) {
      this.drawDevModeLayer(entityGrid);
    }

    this.drawSelector();

    entityGrid.forEach((cell) => {
      if (cell.value) {
        cell.value.drawEntity(
          this.context,
          this.imageLoader,
          this.cameraOffset
        );
      }
    });
  };

  private drawDevModeLayer = (entityGrid: EntityGrid) => {
    this.drawGrid(entityGrid);

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

  private drawGrid = (entityGrid: EntityGrid) => {
    const outline = this.imageLoader.getLoadedImage("/redoutline.png");
    const blueSelector = this.imageLoader.getLoadedImage("/blueselector.png");
    const yellowSelector = this.imageLoader.getLoadedImage(
      "/yellowselector.png"
    );

    entityGrid.forEach((cell) => {
      const { x, y } = cell.matrixCell.toXYCoord();
      const playerCellQueue = this.player.getMovementCellQueue();
      const isoCell = cell.matrixCell.toIsoCell();

      if (playerCellQueue.find(isoCell.equals)) {
        this.drawSimpleImage(yellowSelector, x - 1, y - 1);
      } else if (!cell.value) {
        this.drawSimpleImage(outline, x, y);
      } else {
        this.drawSimpleImage(blueSelector, x - 1, y - 1);
      }
    });
  };

  public drawSelector = () => {
    const selectorImage = this.imageLoader.getLoadedImage("/selector.png");
    const mouseIso = this.mouse.toIsoCell();
    const snapMouse = mouseIso.toXYCoord();

    this.drawSimpleImage(selectorImage, snapMouse.x - 1, snapMouse.y - 1);
  };

  public updateCamera = () => {
    const { i, j, k, l } = this.cameraMovementKeys;
    this.cameraOffset.x += (l ? 1 : 0) + (j ? -1 : 0);
    this.cameraOffset.y += (k ? 1 : 0) + (i ? -1 : 0);
    this.setSafeCameraOffset();
  };

  public drawSimpleImage = (
    image: CanvasImageSource,
    dx: number,
    dy: number
  ) => {
    const { x, y } = this.cameraOffset;

    this.context.drawImage(image, dx - x, dy - y);
  };

  public drawComplexImage = (
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

  public fillText = (
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

  public getAdjustedWindowDimensions = () => {
    const zoom = this.getZoom();
    return {
      w: window.innerWidth / zoom,
      h: window.innerHeight / zoom,
    };
  };

  public drawWalkableArea = () => {
    this.context.strokeStyle = "red";
    this.context.lineWidth = 1;

    const { w, h } = this.getAdjustedWindowDimensions();

    this.context.strokeRect(w / 5, h / 5, (3 * w) / 5, (3 * h) / 5);
  };

  public walkableAreaRelativeCoord = (xyCoord: XYCoord) => {
    const { x, y } = xyCoord;
    const { w, h } = this.getAdjustedWindowDimensions();

    const xAdjusted = x - this.cameraOffset.x;
    const yAdjusted = y - this.cameraOffset.y;

    const xSide = xAdjusted < w / 5 ? -1 : xAdjusted > (4 * w) / 5 ? 1 : 0;
    const ySide = yAdjusted < h / 5 ? -1 : yAdjusted > (4 * h) / 5 ? 1 : 0;

    return new XYCoord(xSide, ySide);
  };

  public startListeners = (entityGrid: EntityGrid) => {
    const { canvas } = this.worldManager;

    this.startAutomaticResizing();
    canvas.onmousemove = this.mouseMoveListener;
    canvas.onkeydown = this.keyDownListener;
    canvas.onkeyup = this.keyUpListener;
    canvas.onmousedown = (ev) => this.mouseDownListener(ev, entityGrid);
  };

  public getZoom = () => {
    const { canvas } = this.worldManager;
    const zoom = canvas.style.getPropertyValue("zoom");
    if (!zoom) throw Error("Cannot find zoom property on MapCanvas!");

    return parseFloat(zoom);
  };

  public setZoom = (zoom: number) => {
    const { canvas } = this.worldManager;
    canvas.style.setProperty("zoom", `${zoom}`);
  };

  public getMapDimensions = () => {
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

  public mouseMoveListener = (ev: MouseEvent) => {
    this.mouse = this.getMousePosition(ev);
  };

  public mouseDownListener = (ev: MouseEvent, entityGrid: EntityGrid) => {
    const mousePosition = this.getMousePosition(ev);
    const destination = mousePosition.toIsoCell();

    this.player.setDestination(destination, entityGrid);
  };

  public keyDownListener = (ev: KeyboardEvent) => {
    const { worldManager, cameraMovementKeys } = this;
    const key = ev.key.toLocaleLowerCase();

    this.player.setMoveState(key, true);

    switch (key) {
      case "`":
        worldManager.devMode = !worldManager.devMode;
        break;
      case "i":
      case "j":
      case "k":
      case "l":
        cameraMovementKeys[key] = true;
        break;
      default:
        break;
    }
  };

  public keyUpListener = (ev: KeyboardEvent) => {
    const { cameraMovementKeys } = this;
    const key = ev.key.toLocaleLowerCase();

    this.player.setMoveState(key, false);

    switch (key) {
      case "i":
      case "j":
      case "k":
      case "l":
        cameraMovementKeys[key] = false;
        break;
      default:
        return;
    }
  };

  public startAutomaticResizing = () => {
    this.resizeCanvas();
    window.onresize = this.resizeCanvas;
  };

  public resizeCanvas = () => {
    const { canvas } = this.worldManager;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

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

  public focusCameraOnPlayer = () => {
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
