import Head from 'next/head';

export function Meta() {
  return (
    <Head>
      <title>mapper</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />

      <meta name="description" content="Plan your meetings efficiently" />

      <meta property="og:url" content="https://mapper-eight.vercel.app" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content="mapper" key="ogTitle" />
      <meta property="og:description" content="Your money management software" />
      <meta property="og:image" content="https://mapper-eight.vercel.app/images/mapper-logo.png" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta property="twitter:domain" content="mapper-eight.vercel.app" />
      <meta property="twitter:url" content="https://mapper-eight.vercel.app" />
      <meta name="twitter:title" content="mapper" />
      <meta name="twitter:description" content="Plan your meetings efficiently" />
      <meta name="twitter:image" content="https://mapper-eight.vercel.app/images/mapper-logo.png" />
    </Head>
  );
}
