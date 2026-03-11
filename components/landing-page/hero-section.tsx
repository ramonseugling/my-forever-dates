import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Balloon,
  CalendarHeart,
  ChevronRight,
  Gift,
  Heart,
  PartyPopper,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const eventTypes = [
  { label: 'aniversários', color: 'hsl(340, 75%, 68%)' },
  { label: 'datas especiais', color: 'hsl(25, 85%, 65%)' },
];

export const HeroSection = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % eventTypes.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative isolate flex min-h-[calc(100vh-57px)] flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 gradient-soft" />
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 50%, hsl(340,75%,68%) 0%, transparent 50%), radial-gradient(circle at 80% 20%, hsl(25,85%,65%) 0%, transparent 50%)',
        }}
      />

      {/* Floating decorative elements */}
      <motion.div
        animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
        className="absolute top-[3%] left-[2%] hidden pointer-events-none sm:block md:top-[8%] md:left-[8%] lg:top-[10%] lg:left-[12%]"
      >
        <PartyPopper
          className="w-20 h-20 text-primary opacity-30"
          fill="currentColor"
        />
      </motion.div>
      <motion.div
        animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
        className="absolute bottom-[5%] right-[2%] hidden pointer-events-none sm:block md:bottom-[12%] md:right-[8%] lg:bottom-[20%] lg:right-[12%]"
      >
        <Balloon className="w-20 h-20 text-secondary opacity-30" />
      </motion.div>
      <motion.div
        animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
        className="absolute top-[5%] right-[2%] hidden pointer-events-none lg:block lg:top-[15%] lg:right-[10%]"
      >
        <Gift className="w-20 h-20 text-accent opacity-30" />
      </motion.div>
      <motion.div
        animate={{ y: [0, 15, 0], rotate: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 5.5, ease: 'easeInOut' }}
        className="absolute bottom-[5%] left-[2%] hidden pointer-events-none lg:block lg:bottom-[15%] lg:left-[10%]"
      >
        <CalendarHeart className="w-20 h-20 text-primary opacity-20" />
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 flex max-w-4xl flex-col items-center px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-white/80 px-4 py-2 text-sm font-semibold text-primary shadow-sm backdrop-blur-sm"
        >
          <Sparkles className="h-4 w-4" />
          <span>O seu novo assistente de datas importantes</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6 flex w-full flex-col items-center"
        >
          <h1 className="flex flex-col items-center text-6xl font-bold tracking-tight leading-[1.1] lg:text-7xl">
            <span className="mb-2 block text-foreground sm:mb-4">
              Nunca mais esqueça
            </span>
            <div className="w-full max-w-[900px] px-4 py-2 text-center">
              <AnimatePresence mode="wait">
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                  className="block w-full text-center"
                  style={{ color: eventTypes[index].color }}
                >
                  {eventTypes[index].label}
                </motion.span>
              </AnimatePresence>
            </div>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto mb-10 max-w-2xl px-4 text-lg font-medium leading-relaxed text-muted-foreground sm:text-xl"
        >
          Ajudamos você a lembrar as datas mais importantes de quem você ama.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex w-full flex-col items-center justify-center gap-4 px-6 sm:w-auto sm:flex-row"
        >
          <Link href="/signup">
            <Button
              size="lg"
              className="gradient-warm text-white shadow-warm text-lg px-8 py-6 rounded-full transition-smooth hover:scale-105 hover:opacity-90"
            >
              Criar minha conta grátis
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="/login">
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground text-lg px-8 py-6 rounded-full transition-smooth hover:scale-105"
            >
              Já tenho conta
            </Button>
          </Link>
        </motion.div>

        {/* <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12 flex flex-wrap justify-center gap-6 px-4 text-sm font-medium text-muted-foreground"
        >
          <div className="flex items-center gap-2">
            <BellRing className="h-4 w-4 text-primary" />
            <span>Lembretes por e-mail</span>
          </div>
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-primary" />
            <span>100% Gratuito</span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-primary" />
            <span>Cadastre quantas datas quiser</span>
          </div>
        </motion.div> */}
      </div>
    </section>
  );
};
