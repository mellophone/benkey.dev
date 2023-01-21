import { DefaultHead } from "@/components/DefaultHead";
import styles from "@/styles/Home.module.css";
import { Sprite } from "@/components/Sprites";
import { Card, Column, Row } from "@/components/Containers";
import Image from "next/image";

export default function Home() {
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
        <Sprite name="ben" id="b1" xi={-10} yi={-10} />
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
          </div>
        </div>
      </main>
    </>
  );
}
