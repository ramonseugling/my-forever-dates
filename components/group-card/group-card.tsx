import { Cake, Calendar, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { MONTHS } from '@/lib/constants';
import type { BirthdayMember } from '@/lib/types';

const MAX_VISIBLE_BIRTHDAYS = 3;

interface GroupCardProps {
  name: string;
  role: 'owner' | 'member';
  memberCount: number;
  upcomingBirthdays: BirthdayMember[];
  onClick: () => void;
}

function getDaysText(days: number): string {
  if (days === 0) return 'Hoje! 🎉';
  if (days === 1) return 'Amanhã';
  return `Em ${days} dias`;
}

export const GroupCard = ({
  name,
  role,
  memberCount,
  upcomingBirthdays,
  onClick,
}: GroupCardProps) => {
  const visible = upcomingBirthdays.slice(0, MAX_VISIBLE_BIRTHDAYS);
  const overflow = upcomingBirthdays.length - MAX_VISIBLE_BIRTHDAYS;

  return (
    <Card
      className="rounded-3xl border-border/50 overflow-hidden transition-smooth hover:scale-[1.02] hover:shadow-glow cursor-pointer animate-fade-in"
      onClick={onClick}
    >
      <div className="p-6 bg-card">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-violet/10 text-violet">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-semibold text-lg text-foreground">
                {name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {memberCount} {memberCount === 1 ? 'membro' : 'membros'}
              </p>
            </div>
          </div>
          <Badge
            className={`rounded-full px-3 py-1 font-semibold ${
              role === 'owner'
                ? 'gradient-violet text-white hover:opacity-90'
                : 'bg-violet/10 text-violet hover:bg-violet/20'
            }`}
          >
            {role === 'owner' ? 'Criador' : 'Membro'}
          </Badge>
        </div>

        {visible.length > 0 && (
          <div className="border-t border-border/40 pt-4 flex flex-col gap-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Próximos aniversários
            </p>

            {visible.map((b, i) => {
              const isUrgent = b.days_until <= 7;
              return (
                <div key={i} className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                        isUrgent
                          ? 'gradient-warm text-white'
                          : 'bg-violet/10 text-violet'
                      }`}
                    >
                      <Cake className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-heading font-semibold text-sm text-foreground truncate leading-tight">
                        {b.name}
                      </p>
                      <div className="flex items-center gap-1 mt-0.5 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3 shrink-0" />
                        <span>
                          {b.birth_day} de {MONTHS[b.birth_month - 1]}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Badge
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold shrink-0 mt-0.5 ${
                      isUrgent
                        ? 'gradient-warm text-white'
                        : 'bg-violet/10 text-violet hover:bg-violet/20'
                    }`}
                  >
                    {getDaysText(b.days_until)}
                  </Badge>
                </div>
              );
            })}

            {overflow > 0 && (
              <p className="text-xs text-muted-foreground -mt-1">
                e mais {overflow}{' '}
                {overflow === 1 ? 'aniversariante' : 'aniversariantes'}
              </p>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};
