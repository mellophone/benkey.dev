import type { AppProps } from "next/app";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, height=device-height, initial-scale=1.0, viewport-fit=cover"
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="theme-color" content="#000000" />
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
