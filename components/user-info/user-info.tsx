import { Mail, User } from 'lucide-react';

interface UserInfoProps {
  name: string;
  email: string;
}

export const UserInfo = ({ name, email }: UserInfoProps) => {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
        <User className="w-5 h-5" />
      </div>
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="font-heading font-semibold text-sm text-foreground truncate">
          {name}
        </span>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Mail className="w-3 h-3 shrink-0" />
          <span className="text-xs truncate">{email}</span>
        </div>
      </div>
    </div>
  );
};
