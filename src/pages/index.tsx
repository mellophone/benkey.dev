import { Source_Code_Pro, ZCOOL_KuaiLe } from "@next/font/google";
import { useEffect, useState } from "react";

const sourceCodePro = Source_Code_Pro({
  preload: true,
  weight: ["400"],
  subsets: ["latin"],
});

const endText = "ben_key";
const letters = "abcdefghijklmnopqrstuvwxyz_.";

const getRandomLetter = () => {
  const randInd = Math.floor(Math.random() * letters.length);

  return letters[randInd];
};

export default function Home() {
  useEffect(() => {
    let count = 0;
    setStillColor("red");

    const loop = setInterval(() => {
      let still = "";
      let curText = "";

      const startCount = 70;

      if (count <= startCount) {
        setTitleOpacity(count / startCount);
      }

      const curTime = (count - 120) / 20;

      for (let i = 0; i < endText.length; i++) {
        if (i < curTime) {
          still += endText[i];
        } else if (endText[i] === " ") {
          curText += " ";
        } else {
          curText += getRandomLetter();
        }
      }

      if (endText.length - 1 < curTime) {
        setStillColor("limegreen");
        clearInterval(loop);
      }

      setStillText(still);
      setFlashText(curText);
      count++;
    }, 10);

    return () => clearInterval(loop);
  }, []);

  const [stillColor, setStillColor] = useState("red");
  const [stillText, setStillText] = useState("lmaufpe");
  const [flashText, setFlashText] = useState("");
  const [titleOpacity, setTitleOpacity] = useState(0);

  const [isBoxFocused, setIsBoxFocused] = useState(false);
  const [isBoxOn, setIsBoxOn] = useState(false);
  const [boxText, setBoxText] = useState("");
  const [boxPing, setBoxPing] = useState(false);
  const [boxIndex, setBoxIndex] = useState(0);

  useEffect(() => {
    if (!isBoxFocused) {
      setIsBoxOn(false);
      return;
    }

    setIsBoxOn(true);

    const loop = setInterval(() => {
      setIsBoxOn((prev) => !prev);
    }, 500);

    return () => clearInterval(loop);
  }, [isBoxFocused, boxPing]);

  return (
    <main>
      <FullScreen>
        <div
          className={sourceCodePro.className}
          style={{ textAlign: "center" }}
        >
          <div style={{ fontSize: 90, opacity: titleOpacity }}>
            <span style={{ color: stillColor }}>{stillText}</span>
            <span>{flashText}</span>
          </div>
          <div style={{ fontSize: 24 }}>software_developer</div>
          <br />
          <div
            // contentEditable
            tabIndex={0}
            spellCheck={false}
            onFocus={() => {
              setIsBoxFocused(true);
            }}
            onBlur={() => {
              setIsBoxFocused(false);
            }}
            onKeyDown={(ev) => {
              setBoxPing((prev) => !prev);
              if (ev.key === "ArrowRight") {
                setBoxIndex((prev) =>
                  prev === boxText.length ? prev : prev + 1
                );
              } else if (ev.key === "ArrowLeft") {
                setBoxIndex((prev) => (prev === 0 ? 0 : prev - 1));
              } else if (ev.key.length === 1) {
                setBoxIndex((prev) => prev + 1);
                setBoxText((prev) => `${prev}${ev.key}`);
              } else if (ev.key === "Backspace") {
                if (boxText.length < boxIndex) {
                  setBoxIndex(boxText.length - 1);
                }
                setBoxText((prev) => prev.substring(0, prev.length - 1));
              }
            }}
            style={{
              fontSize: 24,
              color: stillColor,
              border: "solid white 1px",
              borderRadius: 10,
              textAlign: "left",
              padding: 5,
            }}
          >
            <span style={{ color: "white" }}>{" $ "}</span>
            <span>{boxText.substring(0, boxIndex)}</span>
            <span
              style={{
                backgroundColor: isBoxOn ? stillColor : "transparent",
                color: isBoxOn ? "InfoBackground" : stillColor,
              }}
            >
              {boxIndex < boxText.length ? boxText[boxIndex] : "⠀"}
            </span>
            <span>{boxText.substring(boxIndex + 1)}</span>
          </div>
        </div>
      </FullScreen>
    </main>
  );
}

const FullScreen = (props: { children?: any }) => {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 20,
      }}
    >
      {props.children}
    </div>
  );
};
