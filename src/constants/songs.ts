const songIds = [
  "1440871882",
  "1440847771",
  "1334814531",
  "1440850022",
  "1710738936",
  "1439818074",
  "1440882184",
  "421468395",
  "1742012460",
  "273714713",
  "1796274189",
  "992221997",
  "1586495455",
  "325550983",
  "850569471",
  "1829744973",
  "1551377314",
  "1443199004",
  "513473337",
  "1740876110",
  "558262590",
  "124905963",
  "1146195714",
  "1825917639",
  "850576665",
];

export const getSongOfTheDay = (): string => {
  const milliseconds = new Date().getTime();
  const hoursSince1970 = milliseconds / (1000 * 60 * 60);
  const daysSince1970CST = (hoursSince1970 - 5) / 24;
  const index = Math.floor(daysSince1970CST) % songIds.length;
  const songId = songIds[index];
  return songId;
};
