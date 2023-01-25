export type ins = {
  data:
    | {
        action: "wave";
        speed: number;
        times: number;
      }
    | {
        action: "walk";
        direction: "SE" | "SW" | "NW" | "NE";
        speed: number;
        times: number;
      }
    | {
        action: "blink";
        speed: number;
      };
  complete: boolean;
};

export const spriteNames = [
  "ben",
  "mihir",
  "gen",
  "frank",
  "alizain",
  "johnny",
  "nathan",
  "apollo",
  "august",
  "chris",
  "giselle",
  "bryant",
  "nicole",
] as const;

export const spriteLinks = [
  "https://linkedin.com/in/-ben-key-",
  "https://mihirsahu.com",
  "https://www.linkedin.com/in/genesis-alvarez/",
  "https://www.linkedin.com/in/frank-bui/",
  "https://www.alizaincharolia.com/",
  "https://johnnyle.io/",
  "https://www.linkedin.com/in/nathvnguyen/",
  "https://www.linkedin.com/in/apollo-nguyen-175461222/",
  "https://www.linkedin.com/in/august-estes-297877102/",
  "https://www.linkedin.com/in/christopher-turcios/",
  "https://www.linkedin.com/in/giselleruiz/",
  "https://bnle.me/",
  "https://www.linkedin.com/in/nicoleperezp/",
];

export type spriteName = typeof spriteNames[number];

export type friendStatesObject = {
  [n in spriteName]?: ins | undefined;
};

export type friendStatesHook = [
  friendStatesObject,
  React.Dispatch<React.SetStateAction<friendStatesObject>>
];
