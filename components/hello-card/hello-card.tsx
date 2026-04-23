interface HelloCardProps {
  name: string;
  hasCurrentMonthEvents: boolean;
  onAddClick?: () => void;
}

export const HelloCard = ({
  name,
  hasCurrentMonthEvents,
  onAddClick,
}: HelloCardProps) => {
  const currentMonth = new Date().toLocaleDateString('pt-BR', {
    month: 'long',
  });

  return (
    <div className="mb-8 animate-fade-in flex items-start justify-between gap-4">
      <div>
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
      {onAddClick && (
        <button
          onClick={onAddClick}
          className="hidden md:flex items-center gap-2 gradient-warm text-white rounded-2xl px-5 py-2.5 text-sm font-semibold hover:opacity-90 transition-smooth shrink-0 mt-1"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Adicionar
        </button>
      )}
    </div>
  );
};
