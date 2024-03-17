import type { AppProps } from "next/app";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, viewport-fit=cover"
        />
      </Head>
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
