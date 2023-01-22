/* eslint-disable react-hooks/exhaustive-deps */
import { DefaultHead } from "@/components/DefaultHead";
import styles from "@/styles/Home.module.css";
import { BenSprite, FriendSprite } from "@/components/Sprites";
import { Card, Column, Row } from "@/components/Containers";
import Image from "next/image";
import { Icon } from "@/components/Icons";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ins } from "@/components/Types";

export default function Home() {
  const benState = useState<ins | undefined>(undefined);
  const [ben, setBen] = benState;

  const friendState = useState<ins | undefined>(undefined);

  useEffect(() => {
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
        <FriendSprite
          name="kevin"
          id="friend1"
          xi={200}
          yi={75}
          instruction={friendState}
        />
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
              <span className={styles.title}>ben key</span>
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
