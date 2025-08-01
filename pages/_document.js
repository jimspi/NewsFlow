import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="description" content="AI-powered editorial workflow for journalism teams" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
