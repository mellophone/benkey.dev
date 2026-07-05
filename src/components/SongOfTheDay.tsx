"use client";
import { songIds } from "../constants/songs";
import TrackPreview from "./TrackPreview";

const SongOfTheDay = () => {
  const getSongOfTheDay = (): string => {
    const milliseconds = new Date().getTime();
    const hoursSince1970 = milliseconds / (1000 * 60 * 60);
    const daysSince1970CST = (hoursSince1970 - 5) / 24;
    const index = Math.floor(daysSince1970CST) % songIds.length;
    const songId = songIds[index];
    return songId;
  };

  return <TrackPreview id={getSongOfTheDay()} />;
};

export default SongOfTheDay;
