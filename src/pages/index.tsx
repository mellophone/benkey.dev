/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
import { DefaultHead } from "@/components/DefaultHead";
import styles from "@/styles/Home.module.css";
import { BenSprite, FriendSprite } from "@/components/Sprites";
import { Card, Column, Row } from "@/components/Containers";
import Image from "next/image";
import { Icon } from "@/components/Icons";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  friendStatesObject,
  ins,
  spriteLinks,
  spriteName,
  spriteNames,
} from "@/components/Types";
import dynamic from "next/dynamic";
import NoSSR from "@/components/NoSSR";
import { Fountain } from "@/components/Objects";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Home() {
  const friendStates = useState<friendStatesObject>({});
  const [xyi, setXYI] = useState<[number, number]>([10, 10]);

  const [spriteGrid, setSpriteGrid] = useState<boolean[][]>(() => {
    const arr: boolean[][] = [];
    for (let x = 0; x < 13; x++) {
      const row = [];
      for (let y = 0; y < 50; y++) {
        row.push(false);
      }
      arr.push(row);
    }
    const fountain = [
      [4, 8],
      [4, 9],
      [4, 10],
      [5, 6],
      [5, 7],
      [5, 8],
      [5, 9],
      [5, 10],
      [5, 11],
      [5, 12],
      [6, 5],
      [6, 6],
      [6, 7],
      [6, 8],
      [6, 9],
      [6, 10],
      [6, 11],
      [6, 12],
      [6, 13],
      [7, 7],
      [7, 8],
      [7, 9],
      [7, 10],
      [7, 11],
      [8, 9],
    ];
    fountain.forEach(([x, y]) => {
      arr[x][y + 6] = true;
    });
    arr[0][0] = true;
    arr[1][1] = true;
    return arr;
  });

  useEffect(() => {
    friendStates[0]["ben"] = {
      complete: false,
      data: {
        action: "walk",
        direction: "SE",
        speed: 50,
        times: 5,
      },
    };
    friendStates[1](friendStates[0]);
    window.onkeydown = (e) => {
      if (friendStates[0]["ben"] && !friendStates[0]["ben"].complete) return;
      friendStates[0]["ben"] = {
        complete: false,
        data: {
          action: "walk",
          direction:
            e.key == "w"
              ? "NE"
              : e.key == "d"
              ? "SE"
              : e.key == "s"
              ? "SW"
              : "NW",
          speed: 50,
          times: 1,
        },
      };
    };
  }, []);

  const getAvailableXY = (): [number, number] => {
    let randX = Math.floor(Math.random() * 25) * 10;
    let randY =
      Math.floor(Math.random() * 11) * 10 + (randX % 20 === 0 ? 5 : 0);
    let r = (randX - (randX % 20)) / 20;
    let c = randY / 5;
    if (spriteGrid[r][c]) {
      return getAvailableXY();
    }
    return [randX, randY] as [number, number];
  };

  const setXY = (x: number, y: number): void => {
    let r = Math.round((x - (x % 20)) / 20);
    let c = Math.round(y / 5);
    spriteGrid[r][c] = true;
  };

  const unsetXY = (x: number, y: number): void => {
    let r = Math.round((x - (x % 20)) / 20);
    let c = Math.round(y / 5);
    spriteGrid[r][c] = false;
  };

  const getXY = (x: number, y: number): boolean => {
    let r = Math.round((x - (x % 20)) / 20);
    let c = Math.round(y / 5);
    return spriteGrid[r][c];
  };

  const gridPack = {
    spriteGrid,
    setXY,
    unsetXY,
    getXY,
  };

  const getSprites = () => {
    const sprites = [];

    sprites.push(
      <NoSSR key={`benssr`}>
        <BenSprite
          name="ben"
          id="ben1"
          xi={-10}
          yi={-10}
          instruction={friendStates}
          key="ben1"
        />
      </NoSSR>
    );

    const xyList: [number, number][] = [];

    for (let i = 1; i < spriteNames.length; i++) {
      const xy = getAvailableXY();
      const friendSprite = (
        <NoSSR key={`friend${i}ssr`}>
          <FriendSprite
            name={spriteNames[i]}
            gridPack={gridPack}
            id={`friend${i}`}
            xyi={xy}
            instruction={friendStates}
            link={spriteLinks[i]}
            key={`friend${i}`}
          />
        </NoSSR>
      );
      setXY(xy[0], xy[1]);
      xyList.push(xy);
      sprites.push(friendSprite);
    }

    xyList.forEach((xy) => {
      unsetXY(xy[0], xy[1]);
    });
    return sprites;
  };
  const router = useRouter();

  return (
    <>
      <DefaultHead />
      <style jsx global>{`
        body {
          margin: 0px;
          padding: 0px;
          overflow: hidden;
          position: relative;
          background-color: black;
        }
      `}</style>
      <main>
        <img
          alt="Home Area"
          src={"/SpawnTest.png"}
          // width={310 * 7.5}
          // height={164 * 7.5}
          style={{
            margin: 0,
            padding: 0,
            // width: 310 * 7.5,
            height: "calc(100vh * 164 / 140)",
            // minWidth: `max(${31000 / 164}lvh, 100lvw)`,
            minHeight: `${16400 / 310}lvw`,
            aspectRatio: 310 / 164,
          }}
        />
        {/* {getSprites()} */}
        {/* <Fountain xi={87} yi={29} /> */}
        {/* <div
          className={styles.container}
          style={{
            backgroundImage: `url(/parktest.png)`,
            backgroundSize: "100%",
            backgroundRepeat: "repeat",
          }}
        >
          <button
            onClick={() => {
              friendStates[0]["ben"] = {
                complete: false,
                data: {
                  action: "dance",
                  style: "simple",
                  speed: 175,
                  times: 3,
                },
              };
              friendStates[1](friendStates[0]);
            }}
          >
            Dance 1
          </button>
          <button
            onClick={() => {
              friendStates[0]["ben"] = {
                complete: false,
                data: {
                  action: "dance",
                  style: "jumpy",
                  speed: 100,
                  times: 4,
                },
              };
              friendStates[1](friendStates[0]);
            }}
          >
            Dance 2
          </button>
          <button
            onClick={() => {
              friendStates[0]["ben"] = {
                complete: false,
                data: {
                  action: "dance",
                  style: "army",
                  speed: 75,
                  times: 2,
                },
              };
              friendStates[1](friendStates[0]);
            }}
          >
            Dance 3
          </button>
          <div className={styles.center}>
            <Card>
              <span
                className={styles.title}
                onClick={() => {
                  friendStates[0]["ben"] = {
                    complete: false,
                    data: {
                      action: "walk",
                      direction: "NW",
                      speed: 50,
                      times: 3,
                    },
                  };
                  setTimeout(() => {
                    router.reload();
                  }, 1500);
                }}
              >
                ben key
              </span>
              <span className={styles.subtitle}>software developer</span>
            </Card>
            <br />
            <Card>
              <Column>
                <span className={styles.aboutme}>About Me</span>
                <Row>
                  <Image
                    src="/headshot.png"
                    alt="headshot.png"
                    className={styles.headshot}
                    width={1000}
                    height={1000}
                  />
                  <div
                    style={{
                      display: "inline-block",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <p className={styles.introduction}>
                      {
                        "Hey there! My name is Benjamin Key and I'm currently a student at the University of Houston studying Math and Computer Science! Thanks for checking out my website! I will be updating this frequently. In the meantime, please enjoy your stay!"
                      }
                    </p>
                  </div>
                </Row>
              </Column>
            </Card>
            <br />
            <Icon name="resume" link="/Resume.pdf" />
            <Icon name="linkedin" link="https://linkedin.com/in/-ben-key-" />
            <Icon name="github" link="https://github.com/mellophone" />
            <Icon name="gmail" link="mailto:bkey3125@gmail.com" />
            <Icon
              name="discord"
              link="https://discordapp.com/users/318511797642592257"
            />
            <Icon
              name="spotify"
              link="https://open.spotify.com/user/iep6b6xqxe1hrs734pehvz3rd"
            />
          </div>
        </div> */}
      </main>
    </>
  );
}
