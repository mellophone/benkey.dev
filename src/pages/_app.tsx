import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <style jsx global>{`
        html {
          overflow: hidden;
        }

        body {
          position: relative;
          margin: 0px;
          padding: 0px;
          overflow: hidden;
          background-color: black;
        }
      `}</style>
      <Component {...pageProps} />
    </>
  );
}
