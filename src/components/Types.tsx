type ins = {
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
