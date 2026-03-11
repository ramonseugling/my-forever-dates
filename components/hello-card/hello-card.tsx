interface HelloCardProps {
  name: string;
  hasCurrentMonthEvents: boolean;
}

export const HelloCard = ({ name, hasCurrentMonthEvents }: HelloCardProps) => {
  const currentMonth = new Date().toLocaleDateString('pt-BR', {
    month: 'long',
  });

  return (
    <div className="mb-8 animate-fade-in">
      <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-2">
        Olá, {name}! 👋
      </h2>
      <p className="text-lg text-muted-foreground">
        {hasCurrentMonthEvents ? (
          <>
            Aqui estão as datas importantes de{' '}
            <span className="font-semibold text-primary capitalize">
              {currentMonth}
            </span>
          </>
        ) : (
          'Aqui estão as suas próximas datas importantes'
        )}
      </p>
    </div>
  );
};
