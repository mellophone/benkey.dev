import Image from "next/image";
import styles from "@/styles/Home.module.css";
import { SmallCard } from "./Containers";

const iconNames = [
  "discord",
  "github",
  "gmail",
  "linkedin",
  "resume",
  "spotify",
] as const;
type iconName = typeof iconNames[number];

export const Icon = (props: { name: iconName; link?: string }) => {
  return (
    <a
      href={props.link || "https://benkey.dev"}
      target="_blank"
      rel="noopener noreferrer"
    >
      <SmallCard>
        <Image
          className={styles.icon}
          src={`/icons/${props.name}.png`}
          alt={`${props.name}.png`}
          width={100}
          height={100}
        />
      </SmallCard>
    </a>
  );
};
