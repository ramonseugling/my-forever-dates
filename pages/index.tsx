import type { GetServerSideProps } from 'next';
import { LandingPage } from '@/components/landing-page/landing-page';
import { withGuest } from 'infra/page-guard';

export const getServerSideProps: GetServerSideProps = withGuest();

export default function Home() {
  return <LandingPage />;
}
