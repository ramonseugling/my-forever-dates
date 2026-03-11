import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const CtaSection = () => {
  return (
    <section className="py-10 sm:py-24 relative overflow-hidden">
      <div className="absolute inset-0 gradient-soft" />
      <div
        className="absolute inset-0 opacity-10"
        style={{
          background:
            'radial-gradient(ellipse at center, hsl(340,75%,68%) 0%, transparent 70%)',
        }}
      />
      <div className="container mx-auto text-center relative z-10 px-4">
        <h2 className="text-3xl md:text-5xl font-bold mb-6 animate-fade-in">
          Comece a guardar memórias hoje
        </h2>
        <p
          className="text-base sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-fade-in"
          style={{ animationDelay: '0.2s' }}
        >
          Cada data especial merece ser lembrada. Nunca mais esqueça-as com My
          Forever Dates.
        </p>
        <Link href="/signup">
          <Button
            size="lg"
            className="gradient-warm text-white shadow-warm text-sm px-5 py-2 rounded-2xl transition-smooth hover:scale-105 hover:opacity-90 animate-fade-in sm:text-lg sm:px-12 sm:py-6 sm:rounded-full"
            style={{ animationDelay: '0.4s' }}
          >
            <Sparkles className="mr-2 h-5 w-5" />
            Criar minha conta grátis
          </Button>
        </Link>
      </div>
    </section>
  );
};
