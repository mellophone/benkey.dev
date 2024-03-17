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
  };

  public drawSimpleImage = (
    image: CanvasImageSource,
    dx: number,
    dy: number
  ) => {
    const { x, y } = this.cameraOffset;

    this.context.drawImage(image, dx + x, dy + y);
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

    this.context.drawImage(image, sx, sy, sw, sh, dx + x, dy + y, dw, dh);
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

    this.context.fillText(text, dx + x, dy + y);
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

    return zoom;
  };

  private getMousePosition = (ev: MouseEvent) => {
    const { cameraOffset } = this;

    const zoom = this.getZoom();
    const x = ev.x / parseInt(zoom) - cameraOffset.x;
    const y = ev.y / parseInt(zoom) - cameraOffset.y;

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

  private resizeCanvas = () => {
    const { canvas } = this.worldManager;

    canvas.width = window.outerWidth;
    canvas.height = window.outerHeight;
  };
}
