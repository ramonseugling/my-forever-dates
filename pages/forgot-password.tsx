import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const response = await fetch('/api/v1/password/forgot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    if (response.status === 429) {
      const data = await response.json();
      setError(data.action ?? 'Aguarde uma hora antes de tentar novamente.');
      setLoading(false);
      return;
    }

    setSubmitted(true);
    setLoading(false);
  }

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-8">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <p className="text-muted-foreground">Redefinição de senha</p>
        </div>

        <Card className="p-8 rounded-3xl border-border/50">
          {submitted ? (
            <div className="text-center space-y-4">
              <div className="text-4xl">📬</div>
              <p className="text-foreground font-medium">
                Verifique seu e-mail
              </p>
              <p className="text-sm text-muted-foreground">
                Se este e-mail estiver cadastrado, você receberá um link para
                redefinir sua senha em instantes.
              </p>
              <Link
                href="/login"
                className="block text-sm text-primary font-semibold hover:underline mt-4"
              >
                Voltar para o login
              </Link>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-6">
                Informe seu e-mail e enviaremos um link para você criar uma nova
                senha.
              </p>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label
                    className="text-sm font-medium text-foreground"
                    htmlFor="email"
                  >
                    E-mail
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-smooth"
                    placeholder="seu@email.com"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full gradient-warm text-white rounded-2xl py-3 font-semibold hover:opacity-90 transition-smooth"
                >
                  {loading ? 'Enviando...' : 'Enviar link'}
                </Button>

                {error && (
                  <p className="text-sm text-destructive text-center">
                    {error}
                  </p>
                )}
              </form>

              <p className="text-center text-sm text-muted-foreground mt-6">
                Lembrou a senha?{' '}
                <Link
                  href="/login"
                  className="text-primary font-semibold hover:underline"
                >
                  Entrar
                </Link>
              </p>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
