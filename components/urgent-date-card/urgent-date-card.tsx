import { Heart } from 'lucide-react';

interface UrgentDateCardProps {
  urgentCount: number;
}

export const UrgentDateCard = ({ urgentCount }: UrgentDateCardProps) => {
  return (
    <>
      {urgentCount > 0 && (
        <div className="mb-8 p-6 gradient-warm rounded-3xl shadow-soft animate-scale-in">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-heading font-semibold text-white text-xl">
              Atenção! 🎉
            </h3>
          </div>
          <p className="text-white/90 font-medium">
            Você tem {urgentCount} data
            {urgentCount > 1 ? 's' : ''} importante
            {urgentCount > 1 ? 's' : ''} chegando nos próximos 7 dias!
          </p>
        </div>
      )}
    </>
  );
};
