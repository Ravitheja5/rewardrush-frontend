import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="description" content="RewardRush - Complete micro-tasks, earn reward points, and redeem gift cards securely." />
        {/* Replace ca-pub-XXXXXXXXXXXXXXXX with your actual AdSense Publisher ID upon approval */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
          crossOrigin="anonymous"
        />
      </Head>
      <body style={{ backgroundColor: '#0a0b16', color: '#ffffff', margin: 0, padding: 0 }}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
