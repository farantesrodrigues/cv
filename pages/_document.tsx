import Document, { Head, Html, Main, NextScript } from 'next/document';
import { GoogleAnalytics } from '@next/third-parties/google';

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* Meta tags for SEO */}
          <meta charSet="UTF-8" />
          <meta
            name="description"
            content="This is an interactive CV bot application."
          />

          <meta
            name="description"
            content="Interactive CV explained by a chatbot"
          />
          <meta property="og:title" content="My CV Bot" />
          <meta
            property="og:description"
            content="Interactive CV explained by a chatbot"
          />
          <meta property="og:image" content="/og-image.png" />

          {/* Link to Google Fonts */}
          <link
            href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap"
            rel="stylesheet"
          />

          {/* Favicon */}
          <link rel="icon" href="/favicon.ico" />

          {/* Custom Styles or External CSS */}
          <link
            rel="stylesheet"
            href="https://example.com/custom-stylesheet.css"
          />
        </Head>

        <body>
          <Main />
          <NextScript />
        </body>

        <GoogleAnalytics gaId="G-XYZ" />
      </Html>
    );
  }
}
