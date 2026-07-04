"use client";
import { useEffect, useState } from "react";
import { iTunesPayload, iTunesSong } from "../../types/iTunesPayload";
import Image from "next/image";
import styles from "./index.module.css";
import { PreviewState } from "../../types/PreviewState";
import SectionImage from "../SectionImage";
import Row from "../Row";
import SectionCol from "../SectionCol";
import SectionHeader from "../SectionHeader";
import SectionText from "../SectionText";

const TrackPreview = ({ id }: { id: string }) => {
  const [currentSong, setCurrentSong] = useState<iTunesSong | null>(null);
  const [previewState, setPreviewState] = useState<PreviewState>(
    PreviewState.paused,
  );

  const fetchSong = async () => {
    const url = `/api/itunes/lookup?id=${id}`;
    const request = await fetch(url);
    const payload: iTunesPayload = await request.json();

    if (!payload.results) return;
    if (payload.results.length === 0) return;

    const firstResult = payload.results[0];
    setCurrentSong(firstResult);
  };

  const onClick = (song: iTunesSong) => {
    if (previewState === PreviewState.paused) {
      setPreviewState(PreviewState.playing);
    } else {
      setPreviewState(PreviewState.paused);
    }
  };

  useEffect(() => {
    fetchSong();
  }, []);

  useEffect(() => {
    const audio = document.getElementById(id) as HTMLAudioElement | null;
    if (!audio) return;

    if (previewState === PreviewState.playing) {
      if (audio.paused) {
        audio.play();

        const onPause = () => {
          setPreviewState(PreviewState.paused);
        };

        audio.addEventListener("pause", onPause);
        return () => {
          audio.removeEventListener("pause", onPause);
        };
      }
    } else {
      if (!audio.paused) {
        audio.pause();
      }
    }
  }, [previewState]);

  const getAlbumArt = (song: iTunesSong) => {
    const albumUrl = song.artworkUrl100
      ? song.artworkUrl100.replaceAll("100x100", "750x750")
      : "/devhead.png";

    return (
      <div className={styles.albumArt}>
        <SectionImage src={albumUrl} alt="Album Art" />
      </div>
    );
  };

  const getVinyl = () => {
    const classNames = [styles.vinyl];

    if (previewState === PreviewState.playing) {
      classNames.push(styles.rotating);
    }

    const className = classNames.join(" ");

    return (
      <Image
        className={className}
        src="/vinyl.png"
        alt="Vinyl Record"
        width={300}
        height={300}
      />
    );
  };

  const getAudio = (song: iTunesSong) => {
    if (!song.previewUrl) return <></>;

    return <audio id={id} src={song.previewUrl} preload="metadata" />;
  };

  const getSongPreview = (song: iTunesSong) => {
    const classNames = [styles.previewContainer];

    if (previewState === PreviewState.playing) {
      classNames.push(styles.focused);
    }

    const className = classNames.join(" ");

    return (
      <Row gap={20}>
        <SectionCol>
          <SectionHeader>Song of the Day</SectionHeader>
          <SectionText>{`🎵 ${song.trackName}`}</SectionText>
          <SectionText>{`💿 ${song.collectionName}`}</SectionText>
          <SectionText>{`👤 ${song.artistName}`}</SectionText>
        </SectionCol>
        <div className={className} onClick={() => onClick(song)}>
          {getVinyl()}
          {getAlbumArt(song)}
          {getAudio(song)}
        </div>
      </Row>
    );
  };

  return <>{currentSong ? getSongPreview(currentSong) : "Error!"}</>;
};

export default TrackPreview;
