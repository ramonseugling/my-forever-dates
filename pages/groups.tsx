import { useState } from 'react';
import type { GetServerSideProps } from 'next';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CreateGroupModal } from '@/components/create-group-modal/create-group-modal';
import { GroupCard } from '@/components/group-card/group-card';
import { GroupDetailModal } from '@/components/group-detail-modal/group-detail-modal';
import { GroupEmptyState } from '@/components/group-empty-state/group-empty-state';
import type { BirthdayMember, GroupInfo } from '@/lib/types';
import { withAuth } from 'infra/page-guard';
import group from 'models/group';
import groupMember from 'models/group-member';

interface User {
  id: string;
  name: string;
  email: string;
  birth_day: number | null;
  birth_month: number | null;
  birth_year: number | null;
}

interface GroupsProps {
  user: User;
  groups: GroupInfo[];
}

export const getServerSideProps: GetServerSideProps = withAuth(
  async (_context, user) => {
    const [rawGroups, birthdaysRaw] = await Promise.all([
      group.findAllByUserId(user.id),
      groupMember.findAllBirthdaysByUserId(user.id),
    ]);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    function computeDaysUntil(birth_day: number, birth_month: number): number {
      const nextDate = new Date(
        today.getFullYear(),
        birth_month - 1,
        birth_day,
      );
      if (nextDate < today) nextDate.setFullYear(today.getFullYear() + 1);
      return Math.round(
        (nextDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
      );
    }

    const birthdaysByGroup: Record<string, BirthdayMember[]> = {};
    for (const b of birthdaysRaw) {
      const days_until = computeDaysUntil(b.birth_day, b.birth_month);
      if (days_until > 30) continue;
      if (!birthdaysByGroup[b.group_id]) birthdaysByGroup[b.group_id] = [];
      birthdaysByGroup[b.group_id].push({
        name: b.name,
        birth_day: b.birth_day,
        birth_month: b.birth_month,
        days_until,
      });
    }

    for (const groupId of Object.keys(birthdaysByGroup)) {
      birthdaysByGroup[groupId].sort((a, b) => a.days_until - b.days_until);
    }

    const groups: GroupInfo[] = rawGroups.map(
      (g: {
        id: string;
        name: string;
        invite_code: string;
        role: string;
        member_count: number;
        created_at: string;
      }) => ({
        id: g.id,
        name: g.name,
        invite_code: g.invite_code,
        role: g.role as 'owner' | 'member',
        member_count: g.member_count,
        created_at: String(g.created_at),
        upcoming_birthdays: birthdaysByGroup[g.id] ?? [],
      }),
    );

    return { props: { user, groups } };
  },
);

export default function Groups({ user, groups }: GroupsProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<GroupInfo | null>(null);

  return (
    <div>
      <section className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8">
        {groups.length > 0 && (
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-heading font-bold text-foreground">
              Meus grupos
            </h2>
            <Button
              className="gradient-violet text-white hover:opacity-90 rounded-2xl gap-2"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Plus className="w-4 h-4" />
              Criar grupo
            </Button>
          </div>
        )}

        {groups.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((g, index) => (
              <div key={g.id} style={{ animationDelay: `${index * 0.1}s` }}>
                <GroupCard
                  name={g.name}
                  role={g.role}
                  memberCount={g.member_count}
                  upcomingBirthdays={g.upcoming_birthdays}
                  onClick={() => setSelectedGroup(g)}
                />
              </div>
            ))}
          </div>
        ) : (
          <GroupEmptyState onCreateClick={() => setIsCreateModalOpen(true)} />
        )}
      </section>

      <CreateGroupModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />

      {selectedGroup && (
        <GroupDetailModal
          group={selectedGroup}
          currentUserId={user.id}
          open={!!selectedGroup}
          onOpenChange={(open) => {
            if (!open) setSelectedGroup(null);
          }}
        />
      )}
    </div>
  );
}
