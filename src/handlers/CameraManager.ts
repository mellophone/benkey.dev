// NEEDS MAJOR REFACTOR :: OLD VERSION

class CameraManager {
  // private cameraProps: CameraProps;

  // constructor(cameraProps: CameraProps) {
  //   this.cameraProps = cameraProps;
  //   const { x, y, zoom, mapWidth, mapHeight } = this.cameraProps;

  //   const zoomCorrected = Math.max(
  //     Math.ceil((100 * innerWidth) / mapWidth) / 100,
  //     Math.ceil((100 * innerHeight) / mapHeight) / 100,
  //     zoom
  //   );
  // }
  private canvas: HTMLCanvasElement | undefined;
  private center = [0, 0];
  private zoom = 8;
  private boundedZoom = this.zoom;

  constructor() {}

  public setCanvas = (canvas: HTMLCanvasElement) => {
    this.canvas = canvas;
    window.onresize = this.focus;
  };

  public focus = () => {
    if (!this.canvas) return;

    this.setBoundedZoom();
    this.focusOnCenter();
  };

  private focusOnCenter = () => {
    if (!this.canvas) return;

    const left =
      window.innerWidth / (2 * this.boundedZoom) -
      this.center[0] * this.boundedZoom;
    const top =
      window.innerHeight / (2 * this.boundedZoom) -
      this.center[1] * this.boundedZoom;
    this.canvas.style.left = `${left}px`;
    this.canvas.style.top = `${top}px`;
  };

  private setBoundedZoom = () => {
    if (!this.canvas) return;

    const xZoom = window.innerWidth / this.canvas.width;
    const yZoom = window.innerHeight / this.canvas.height;
    this.boundedZoom = Math.max(xZoom, yZoom, this.zoom);
    this.canvas.style.setProperty("zoom", `${this.boundedZoom}`);
  };

  public getCenter = () => this.center;

  // getCorrectedZoom = (): number => {
  //   const { zoom, mapWidth, mapHeight } = this.cameraProps;
  //   const precision = 100;

  //   const perfectWidthZoom =
  //     Math.ceil((precision * innerWidth) / mapWidth) / precision;
  //   const perfectHeightZoom =
  //     Math.ceil((precision * innerHeight) / mapHeight) / precision;

  //   return Math.max(perfectWidthZoom, perfectHeightZoom, zoom);
  // };

  // getCorrectedXY = (): [number, number] => {
  //   const { x, y, mapHeight, mapWidth, zoom, centerX, centerY } =
  //     this.cameraProps;
  //   const newZoom = this.getCorrectedZoom();

  //   const xMid = x + innerWidth / zoom / 2;
  //   const yMid = y + innerHeight / zoom / 2;

  //   let xCorrected = xMid - innerWidth / newZoom / 2;
  //   let yCorrected = yMid - innerHeight / newZoom / 2;

  //   if (centerX && centerY) {
  //     xCorrected = centerX - innerWidth / newZoom / 2;
  //     yCorrected = centerY - innerHeight / newZoom / 2;
  //   }

  //   const xMax = mapWidth - innerWidth / newZoom;
  //   const yMax = mapHeight - innerHeight / newZoom;

  //   const xTooLow = xCorrected < 0;
  //   const xTooHigh = xCorrected > xMax;
  //   const yTooLow = yCorrected < 0;
  //   const yTooHigh = yCorrected > yMax;

  //   if (xTooLow) xCorrected = 0;
  //   else if (xTooHigh) xCorrected = xMax;

  //   if (yTooLow) yCorrected = 0;
  //   else if (yTooHigh) yCorrected = yMax;

  //   return [xCorrected, yCorrected];
  // };

  // getCorrectedSpecs = (): CameraSpecs => {
  //   const XY = this.getCorrectedXY();
  //   const Z = this.getCorrectedZoom();
  //   return {
  //     camX: XY[0],
  //     camY: XY[1],
  //     zoom: Z,
  //   };
  // };
}

export default CameraManager;

export type CameraSpecs = {
  camX: number;
  camY: number;
  zoom: number;
};

// export type CameraProps = {
//   x: number;
//   y: number;
//   zoom: number;
//   mapWidth: number;
//   mapHeight: number;
//   centerX?: number;
//   centerY?: number;
// };
