import { Iso } from "@/utils/types";

export const getPathIsoList = (start: Iso, end: Iso) => {
  console.log(JSON.stringify(start), JSON.stringify(end));
  const list: Iso[] = [];
  const curIso = [...start];
  let [rCur, cCur] = curIso;

  const rStep = end[0] > start[0] ? 1 : -1;
  const cStep = end[1] > start[1] ? 1 : -1;

  let chances = 0;

  while ((rCur !== end[0] || cCur !== end[1]) && chances < 20) {
    chances++;
    if (rCur === end[0]) {
      cCur += cStep;
    } else if (cCur === end[1]) {
      rCur += rStep;
    } else if (
      totalDistance([rCur + rStep, cCur], start, end) <
      totalDistance([rCur, cCur + cStep], start, end)
    ) {
      rCur += rStep;
    } else {
      cCur += cStep;
    }
    list.push([rCur, cCur]);
  }

  return list;
};

const getLinearDistance = (a: Iso, b: Iso) => {
  const dr = a[0] - b[0];
  const dc = a[1] - b[1];
  return Math.sqrt(dr ** 2 + dc ** 2);
};

const totalDistance = (cur: Iso, start: Iso, end: Iso) =>
  getLinearDistance(cur, start) + getLinearDistance(cur, end);
