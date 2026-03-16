import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Analytics } from '@vercel/analytics/next';
import { Layout } from '@/components/layout/layout';
import { fredoka, quicksand } from '@/lib/fonts';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={quicksand.className}>
      <Head>
        <title>My Forever Dates</title>
        <meta
          name="description"
          content="Nunca mais esqueça as datas importantes das pessoas que você ama."
        />
      </Head>
      <style>{`
        h1, h2, h3, h4, h5, h6, .font-heading {
          font-family: ${fredoka.style.fontFamily};
        }
      `}</style>
      <Layout user={pageProps.user}>
        <Component {...pageProps} />
      </Layout>
      <Analytics />
    </div>
  );
}
