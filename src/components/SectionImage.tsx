import Image from "next/image";
import Col from "./Col";

const SectionImage = ({ src, alt }: { src: string; alt: string }) => {
  return (
    <Col>
      <div
        style={{
          border: "1px solid var(--shadow)",
          boxShadow: "-5px 5px 0px var(--shadow)",
          borderRadius: 5,
          width: 300,
          maxWidth: "100%",
          overflow: "hidden",
        }}
      >
        <Image
          style={{
            display: "block",
            width: "calc(100% + 2px)",
            height: "auto",
            margin: "-1px",
            objectFit: "contain",
          }}
          src={src}
          alt={alt}
          width={500}
          height={500}
        />
      </div>
    </Col>
  );
};

export default SectionImage;
