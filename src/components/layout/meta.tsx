import Head from 'next/head';

export function Meta() {
  return (
    <Head>
      <title>turbomeet</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />

      <meta name="description" content="Plan your meetings efficiently" />

      <meta property="og:url" content="https://turbomeet-eight.vercel.app" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content="turbomeet" key="ogTitle" />
      <meta property="og:description" content="Your money management software" />
      <meta
        property="og:image"
        content="https://turbomeet-eight.vercel.app/images/turbomeet-logo.png"
      />

      <meta name="twitter:card" content="summary_large_image" />
      <meta property="twitter:domain" content="turbomeet-eight.vercel.app" />
      <meta property="twitter:url" content="https://turbomeet-eight.vercel.app" />
      <meta name="twitter:title" content="turbomeet" />
      <meta name="twitter:description" content="Plan your meetings efficiently" />
      <meta
        name="twitter:image"
        content="https://turbomeet-eight.vercel.app/images/turbomeet-logo.png"
      />
    </Head>
  );
}
