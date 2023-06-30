import { MapObject } from "@/types/MapObject";

export const Spawn: MapObject = {
  mapName: "Spawn",
  mapSrc: "/housemap.png",
  textures: [
    {
      src: "/house.png",
      pxOff: 40,
      pyOff: -5,
      filledCells: [
        [11, -4],
        [11, -3],
        [11, -1],
        [11, 0],
        [11, -2],
        [12, 0],
        [13, 0],
        [14, 0],
        [14, -4],
        [13, -4],
        [13, -3],
        [12, -4],
        [12, -3],
        [14, -3],
        [14, -2],
        [14, -1],
        [13, -1],
        [12, -1],
        [12, -2],
        [13, -2],
        [11, -5],
        [12, -5],
        [13, -5],
        [14, -5],
        [15, -5],
        [15, -4],
        [15, -3],
        [15, -2],
        [15, -1],
        [15, 0],
      ],
      interactiveCells: [
        {
          cell: [11, -3],
          interaction: "back-door",
        },
      ],
      renderCells: [
        [11, -5],
        [12, -5],
        [13, -5],
        [14, -5],
        [15, -5],
        [15, -4],
        [15, -3],
        [15, -2],
        [15, -1],
        [15, 0],
        [10, -6],
        [16, 1],
      ],
    },
    {
      src: "/kitty.png",
      pxOff: 164,
      pyOff: 81,
      filledCells: [[16, 0]],
      interactiveCells: [
        {
          cell: [16, 0],
          interaction: "kitty",
        },
      ],
      renderCells: [[16, 0]],
    },
    {
      src: "/mailbox.png",
      pxOff: 198,
      pyOff: 78,
      filledCells: [[18, 1]],
      interactiveCells: [
        {
          cell: [18, 1],
          interaction: "mailbox",
        },
      ],
      renderCells: [[18, 1]],
    },
    {
      src: "/bushes.png",
      pxOff: 120,
      pyOff: 89,
      filledCells: [
        [16, -4],
        [16, -3],
      ],
      interactiveCells: [
        {
          cell: [16, -4],
          interaction: "bushes",
        },
        {
          cell: [16, -3],
          interaction: "bushes",
        },
      ],
      renderCells: [
        [16, -4],
        [16, -3],
      ],
    },
    {
      src: "/door.png",
      pxOff: 150,
      pyOff: 65,
      filledCells: [],
      interactiveCells: [
        {
          cell: [15, -1],
          interaction: "front-door",
        },
      ],
      renderCells: [[15, -1]],
    },
  ],
};