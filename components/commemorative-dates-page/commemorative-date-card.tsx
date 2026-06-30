import { useState } from 'react';
import { useRouter } from 'next/router';
import { Switch } from '@/components/ui/switch';
import type { CommemorativeDateItem } from '@/models/commemorative';

interface CommemorativeDateCardProps {
  item: CommemorativeDateItem;
}

export const CommemorativeDateCard = ({ item }: CommemorativeDateCardProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleToggle = async (checked: boolean) => {
    setLoading(true);
    setError(null);

    try {
      const method = checked ? 'PUT' : 'DELETE';
      const res = await fetch(`/api/v1/commemorative-dates/${item.key}`, {
        method,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message ?? 'Erro ao atualizar.');
      }

      router.replace(router.asPath);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-border/40 bg-card p-5 flex items-center gap-4 animate-fade-in">
      <span className="text-3xl shrink-0" aria-hidden>
        {item.emoji}
      </span>

      <div className="flex-1 min-w-0">
        <p className="font-heading font-semibold text-foreground leading-tight">
          {item.label}
        </p>
        <p className="text-sm text-muted-foreground mt-0.5">
          {item.daysUntil === 0
            ? 'Hoje! 🎉'
            : item.daysUntil === 7
              ? 'Em 7 dias'
              : `Em ${item.daysUntil} dias`}{' '}
          &middot; {item.nextDate}
        </p>
        {error && <p className="text-sm text-destructive mt-1">{error}</p>}
      </div>

      <Switch
        checked={item.enabled}
        onCheckedChange={handleToggle}
        disabled={loading}
        aria-label={`${item.enabled ? 'Desativar' : 'Ativar'} lembrete para ${item.label}`}
      />
    </div>
  );
};
