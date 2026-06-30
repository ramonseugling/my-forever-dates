import { CommemorativeDateCard } from '@/components/commemorative-dates-page/commemorative-date-card';
import type { CommemorativeDateItem } from '@/models/commemorative';

interface CommemorativeDatesListProps {
  items: CommemorativeDateItem[];
}

export const CommemorativeDatesList = ({
  items,
}: CommemorativeDatesListProps) => {
  return (
    <div className="flex flex-col gap-4">
      {items.map((item) => (
        <CommemorativeDateCard key={item.key} item={item} />
      ))}
    </div>
  );
};
