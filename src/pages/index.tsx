/* eslint-disable react-hooks/exhaustive-deps */
import { DefaultHead } from "@/components/DefaultHead";
import styles from "@/styles/Home.module.css";
import { BenSprite, FriendSprite } from "@/components/Sprites";
import { Card, Column, Row } from "@/components/Containers";
import Image from "next/image";
import { Icon } from "@/components/Icons";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ins } from "@/components/Types";
import dynamic from "next/dynamic";
import NoSSR from "@/components/NoSSR";

export default function Home() {
  const benState = useState<ins | undefined>(undefined);
  const [ben, setBen] = benState;

  const friendState = useState<ins | undefined>(undefined);
  const [xyi, setxyi] = useState<[number, number]>([10, 10]);
  const friendState2 = useState<ins | undefined>(undefined);
  const [xyi2, setxyi2] = useState<[number, number]>([10, 10]);
  const friendState3 = useState<ins | undefined>(undefined);
  const [xyi3, setxyi3] = useState<[number, number]>([10, 10]);
  const friendState4 = useState<ins | undefined>(undefined);
  const [xyi4, setxyi4] = useState<[number, number]>([10, 10]);
  const friendState5 = useState<ins | undefined>(undefined);
  const [xyi5, setxyi5] = useState<[number, number]>([10, 10]);
  const friendState6 = useState<ins | undefined>(undefined);
  const [xyi6, setxyi6] = useState<[number, number]>([10, 10]);

  const [spriteGrid, setSpriteGrid] = useState<boolean[][]>(() => {
    const arr = [];
    for (let x = 0; x < 13; x++) {
      const row = [];
      for (let y = 0; y < 50; y++) {
        row.push(false);
      }
      arr.push(row);
    }
    arr[0][0] = true;
    arr[1][1] = true;
    return arr;
  });

  useEffect(() => {
    setxyi(getAvailableXY());
    setxyi2(getAvailableXY());
    setxyi3(getAvailableXY());
    setxyi4(getAvailableXY());
    setxyi5(getAvailableXY());
    setxyi6(getAvailableXY());
    setBen({
      complete: false,
      data: {
        action: "walk",
        direction: "SE",
        speed: 50,
        times: 3,
      },
    });
  }, []);

  const getAvailableXY = (): [number, number] => {
    let randX = Math.floor(Math.random() * 25) * 10;
    let randY =
      Math.floor(Math.random() * 11) * 10 + (randX % 20 === 0 ? 5 : 0);
    let r = (randX - (randX % 20)) / 20;
    let c = randY / 5;
    console.log(`${randX} ${randY} -> [${r}][${c}]`);
    // console.log(spriteGrid[r][c]);
    if (spriteGrid[r][c]) {
      return getAvailableXY();
    }
    spriteGrid[r][c] = true;
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

  return (
    <>
      <DefaultHead />
      <style jsx global>{`
        body {
          margin: 0px;
          padding: 0px;
          overflow: hidden;
          position: relative;
        }
      `}</style>
      <main>
        <BenSprite
          name="ben"
          id="mainBen"
          xi={-10}
          yi={-10}
          instruction={benState}
        />
        <NoSSR>
          <FriendSprite
            name="mihir"
            id="friend1"
            instruction={friendState}
            xyi={xyi}
            gridPack={gridPack}
            link={"https://mihirsahu.com"}
          />
          <FriendSprite
            name="gen"
            id="friend2"
            instruction={friendState2}
            xyi={xyi2}
            gridPack={gridPack}
            link={"https://www.linkedin.com/in/genesis-alvarez/"}
          />
          <FriendSprite
            name="frank"
            id="friend3"
            instruction={friendState3}
            xyi={xyi3}
            gridPack={gridPack}
            link={"https://www.linkedin.com/in/frank-bui/"}
          />
          <FriendSprite
            name="alizain"
            id="friend4"
            instruction={friendState4}
            xyi={xyi4}
            gridPack={gridPack}
            link={"https://www.alizaincharolia.com/"}
          />
          <FriendSprite
            name="johnny"
            id="friend5"
            instruction={friendState5}
            xyi={xyi5}
            gridPack={gridPack}
            link={"https://johnnyle.io/"}
          />
          <FriendSprite
            name="nathan"
            id="friend6"
            instruction={friendState6}
            xyi={xyi6}
            gridPack={gridPack}
            link={"https://www.linkedin.com/in/nathvnguyen/"}
          />
        </NoSSR>
        <div
          className={styles.container}
          style={{
            backgroundImage: `url(/ground.png)`,
            backgroundSize: "100%",
            backgroundRepeat: "repeat",
          }}
        >
          <div className={styles.center}>
            <Card>
              <span
                className={styles.title}
                onClick={() => {
                  console.log(spriteGrid);
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
        </div>
      </main>
    </>
  );
}
