import styles from "./page.module.css";
import Section from "../components/Section";
import Row from "../components/Row";
import NavButton from "../components/NavButton";
import SectionText from "../components/SectionText";
import SectionHeader from "../components/SectionHeader";
import SectionCol from "../components/SectionCol";
import SectionImage from "../components/SectionImage";

export default function Home() {
  return (
    <main className={styles.main}>
      <div
        style={{
          width: "100%",
          height: "100svh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Row>
          <NavButton href="#education">Education</NavButton>
          <NavButton href="#experience">Experience</NavButton>
          <NavButton href="#projects">Projects</NavButton>
        </Row>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            justifyContent: "center",
          }}
        >
          <div style={{ fontSize: "min(200px, 24vw)" }}>Ben Key</div>
          <div
            style={{
              fontSize: "min(38px, 4.56vw)",
              opacity: 0.875,
              transform: "translate(min(10px, 1.2vw), max(-80px, -9.6vw))",
            }}
          >
            Developer, Thinker, Problem Solver
          </div>
        </div>
      </div>
      <Section id="welcome" secondary>
        <Row gap={20}>
          <SectionCol>
            <SectionHeader>Welcome!</SectionHeader>
            <SectionText>
              My name is <b>Ben</b> and I'm a software developer from{" "}
              <b>Houston, Texas</b>. I love finding creative new ways to tackle{" "}
              <b>real-world problems</b> and building full-scale applications
              with <b>impact</b>.
            </SectionText>
            <br />
            <SectionText>
              Outside of development, I also really enjoy <b>hiking</b>,{" "}
              <b>bouldering</b>, <b>cooking</b>, and studying <b>mathematics</b>{" "}
              in my free time. I'm always looking for my next <b>adventure</b>{" "}
              and finding ways to <b>better</b> myself.
            </SectionText>
          </SectionCol>
          <SectionImage src="/headshot.png" alt="Ben's Headshot" />
        </Row>
      </Section>
      <Section id="education">
        <Row gap={20} wrapReverse>
          <SectionImage src="/graduation.png" alt="Ben's Graduation" />
          <SectionCol>
            <SectionHeader>Education</SectionHeader>
            <SectionText>
              I received my Bachelors of Science degree from the{" "}
              <b>University of Houston</b> in May 2025. I graduated with a
              double major in <b>Computer Science</b> and <b>Mathematics</b> and
              a minor in <b>Business Administration</b>.
            </SectionText>
            <br />
            <SectionText>
              I was also heavily involved in <b>CougarCS</b>, the <b>largest</b>{" "}
              computer science student organization on campus. I held several
              officer roles throughout my time there, including{" "}
              <b>Director of CodeRED</b>, the university's annual{" "}
              <b>hackathon</b>.
            </SectionText>
          </SectionCol>
        </Row>
      </Section>
      <Section id="experience" secondary>
        <Row gap={20}>
          <SectionCol>
            <SectionHeader>Experience</SectionHeader>
            <SectionText>
              My professional experience started at <b>Paycom</b>. I was offered{" "}
              <b>two</b> consecutive software development <b>internships</b>{" "}
              during my last two summers of college, and then accepted an offer
              to return <b>full-time</b> after my graduation.
            </SectionText>
            <br />
            <SectionText>
              I worked with <b>many</b> different technologies during my time at
              Paycom, including <b>React</b> and <b>TypeScript</b> as well as{" "}
              <b>Swift</b> and <b>UIKit</b>. This early experience gave me a{" "}
              <b>solid</b> foundation to begin a <b>lucrative career</b> in
              software development.
            </SectionText>
          </SectionCol>
          <SectionImage src="/paycom.png" alt="Ben at Paycom" />
        </Row>
      </Section>
      <Section id="projects">
        <Row gap={20} wrapReverse>
          <SectionImage
            src="/devhead.png"
            alt="Ben's Development Profile Picture"
          />
          <SectionCol>
            <SectionHeader>Projects</SectionHeader>
            <SectionText>
              Some of my software projects include:
              <ul style={{ listStylePosition: "inside", paddingLeft: 20 }}>
                <li>
                  <a href="https://github.com/TheRealPercival/Avalon">
                    <b>Avalon</b>
                  </a>
                </li>
                <li>
                  <b>LDAR Mobile App</b>
                </li>
                <li>
                  <a href="https://github.com/mellophone/vibalry">
                    <b>Vibalry</b>
                  </a>
                </li>
                <li>
                  <a href="https://github.com/CougarCS/CougarCS-Bot">
                    <b>CougarCS Discord Bot</b>
                  </a>
                </li>
              </ul>
            </SectionText>
            <br />
            <SectionText>
              I have <b>many</b> other future plans and ideas too, so{" "}
              <b>stick around</b> to see what my next one will be!
            </SectionText>
          </SectionCol>
        </Row>
      </Section>
    </main>
  );
}
