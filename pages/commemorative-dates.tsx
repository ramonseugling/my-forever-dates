import type { GetServerSideProps } from 'next';
import { CommemorativeDatesList } from '@/components/commemorative-dates-page/commemorative-dates-list';
import { withAuth } from 'infra/page-guard';
import commemorative, {
  type CommemorativeDateItem,
} from 'models/commemorative';

interface CommemorativeDatesProps {
  items: CommemorativeDateItem[];
}

export const getServerSideProps: GetServerSideProps = withAuth(
  async (_context, user) => {
    const items = await commemorative.listForUser(user.id);
    return {
      props: { items },
    };
  },
);

export default function CommemorativeDates({ items }: CommemorativeDatesProps) {
  return (
    <section className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-6 max-w-3xl">
      <div className="mb-6 animate-fade-in">
        <h1 className="text-3xl font-heading font-bold text-foreground leading-tight">
          Datas Comemorativas
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Ative os lembretes que deseja receber com 7 dias de antecedência.
        </p>
      </div>

      <CommemorativeDatesList items={items} />
    </section>
  );
}
