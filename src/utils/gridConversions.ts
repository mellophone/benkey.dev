import { PIXEL_MAG } from "@/pages/mapmaker";

export const getRow = (x: number, y: number) =>
  Math.floor((y + (1 / 2) * x - 4.5 * PIXEL_MAG) / (PIXEL_MAG * 10));

export const getCol = (x: number, y: number) =>
  Math.floor(-(y - (1 / 2) * x - 4.5 * PIXEL_MAG) / (PIXEL_MAG * 10));

export const getX = (r: number, c: number) => PIXEL_MAG * 10 * (r + c);

export const getY = (r: number, c: number) => PIXEL_MAG * 5 * (r - c);

export const mousePosToIso = (x: number, y: number): [number, number] => [
  getRow(x, y),
  getCol(x, y),
];

export const isoToSnapPos = (r: number, c: number): [number, number] => [
  getX(r, c),
  getY(r, c),
];

export const mousePosToSnapPos = (x: number, y: number): [number, number] =>
  isoToSnapPos(...mousePosToIso(x, y));

export const isoToArrGrid = (r: number, c: number): [number, number] => {
  const i = r - c;
  const j = c + Math.floor((r - c) / 2);
  return [i, j];
};

export const arrGridToIso = (i: number, j: number): [number, number] => {
  const r = i + j - Math.floor(i / 2);
  const c = j - Math.floor(i / 2);
  return [r, c];
};
