import WorldManager from "./WorldManager";
import { XYCoord } from "../types/Cell";

export default class CameraHandler {
  public cameraOffset = new XYCoord(0, 0);
  public cameraVelocity = {
    w: false,
    a: false,
    s: false,
    d: false,
  };
  public mouse = new XYCoord(-20, -20);
  private context: CanvasRenderingContext2D;

  constructor(public worldManager: WorldManager) {
    const canvasContext = worldManager.canvas.getContext("2d");
    if (!canvasContext) throw Error("Cannot retrieve 2d canvas context!");
    this.context = canvasContext;
    this.startListeners();
  }

  public updateCamera = () => {
    const { w, a, s, d } = this.cameraVelocity;
    this.cameraOffset.x += (d ? 1 : 0) + (a ? -1 : 0);
    this.cameraOffset.y += (s ? 1 : 0) + (w ? -1 : 0);
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

  public startListeners = () => {
    const { canvas } = this.worldManager;

    this.startAutomaticResizing();
    canvas.onmousemove = this.mouseMoveListener;
    canvas.onkeydown = this.keyDownListener;
    canvas.onkeyup = this.keyUpListener;
    canvas.onmousedown = this.mouseDownListener;
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
    const { mapObject, imageLoader } = this.worldManager;

    const mapImage = imageLoader.getLoadedImage(mapObject.mapSrc);
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

  public mouseDownListener = (ev: MouseEvent) => {
    const { ben } = this.worldManager;

    const mousePosition = this.getMousePosition(ev);
    const destination = mousePosition.toIsoCell();

    ben?.setDestination(destination);
  };

  public keyDownListener = (ev: KeyboardEvent) => {
    const { worldManager, cameraVelocity } = this;
    const key = ev.key.toLocaleLowerCase();

    switch (key) {
      case "`":
        worldManager.devMode = !worldManager.devMode;
        return;
      case "w":
        break;
      case "a":
        break;
      case "s":
        break;
      case "d":
        break;

      default:
        return;
    }

    if (worldManager.devMode) {
      cameraVelocity[key] = true;
    }
  };

  public keyUpListener = (ev: KeyboardEvent) => {
    const { cameraVelocity } = this;
    const key = ev.key.toLocaleLowerCase();

    switch (key) {
      case "w":
        break;
      case "a":
        break;
      case "s":
        break;
      case "d":
        break;

      default:
        return;
    }

    cameraVelocity[key] = false;
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
    this.focusCameraOnBen();
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

  public focusCameraOnBen = () => {
    const { ben } = this.worldManager;

    if (!ben) return;

    const xyCoord = ben.currentCell.toCenterXYCoord();
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
