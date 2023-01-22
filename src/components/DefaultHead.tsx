import Head from "next/head";

export const DefaultHead = () => (
  <>
    <Head>
      <title>Ben Key</title>
      <meta name="description" content="Welcome to my website!" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/benicon.png" />

      <meta property="og:image" content="/preview.png" />
      <meta property="og:title" content="Ben Key" />
      <meta property="og:description" content="Welcome to my website!" />
      <meta property="og:image:width" content="2560" />
      <meta property="og:image:height" content="1400" />
    </Head>
  </>
);
