import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-8">
      <div className="w-full max-w-md text-center animate-fade-in">
        <p
          className="text-8xl font-bold font-heading bg-clip-text text-transparent mb-4"
          style={{
            backgroundImage:
              'linear-gradient(135deg, hsl(340, 75%, 68%), hsl(25, 85%, 65%))',
          }}
        >
          404
        </p>
        <h1 className="text-2xl font-semibold font-heading mb-2">
          Página não encontrada :(
        </h1>
        <p className="text-muted-foreground mb-8">
          A página que você está procurando não existe ou foi movida.
        </p>
        <Link href="/">
          <Button className="gradient-warm text-white rounded-2xl px-6 py-3 font-semibold hover:opacity-90 transition-smooth">
            Voltar para o início
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
