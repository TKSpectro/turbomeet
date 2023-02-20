import Head from 'next/head';

export function Meta() {
  return (
    <Head>
      <title>turbomeet</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />

      <meta name="description" content="Your meeting planner, turbocharged" />

      <meta property="og:url" content="https://turbomeet.vercel.app" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content="turbomeet" key="ogTitle" />
      <meta property="og:description" content="Your meeting planner, turbocharged" />
      <meta property="og:image" content="https://turbomeet.vercel.app/images/turbomeet.png" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta property="twitter:domain" content="turbomeet.vercel.app" />
      <meta property="twitter:url" content="https://turbomeet.vercel.app" />
      <meta name="twitter:title" content="turbomeet" />
      <meta name="twitter:description" content="Your meeting planner, turbocharged" />
      <meta name="twitter:image" content="https://turbomeet.vercel.app/images/turbomeet.png" />
    </Head>
  );
}
