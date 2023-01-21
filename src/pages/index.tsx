/* eslint-disable react-hooks/exhaustive-deps */
import { DefaultHead } from "@/components/DefaultHead";
import styles from "@/styles/Home.module.css";
import { Sprite } from "@/components/Sprites";
import { Card, Column, Row } from "@/components/Containers";
import Image from "next/image";
import { Icon } from "@/components/Icons";
import { useEffect, useState } from "react";
import { ins } from "@/components/Types";

export default function Home() {
  const benState = useState<ins | undefined>(undefined);
  const [ben, setBen] = benState;

  useEffect(() => {
    if (!ben) {
      setBen({
        complete: false,
        data: {
          action: "walk",
          direction: "SE",
          speed: 60,
          times: 3,
        },
      });
      return;
    }
  });

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
        <Sprite name="ben" id="b1" xi={-10} yi={-10} instruction={benState} />
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
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                      ullamco laboris nisi ut aliquip ex ea commodo consequat.
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
