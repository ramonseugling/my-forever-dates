import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ANNOUNCEMENTS } from '@/lib/announcements';

interface BroadcastResult {
  sent: number;
  failed: number;
  total: number;
}

export const AdminBroadcast = () => {
  const [selectedKey, setSelectedKey] = useState<string>(ANNOUNCEMENTS[0].key);
  const [recipientCount, setRecipientCount] = useState<number | null>(null);
  const [loadingCount, setLoadingCount] = useState(false);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<BroadcastResult | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!selectedKey) return;
    setRecipientCount(null);
    setResult(null);
    setError('');
    setLoadingCount(true);

    fetch(`/api/v1/admin/broadcast?key=${encodeURIComponent(selectedKey)}`)
      .then((res) => res.json())
      .then((data) => {
        setRecipientCount(data.recipientCount ?? 0);
      })
      .catch(() => {
        setError('Erro ao buscar destinatários.');
      })
      .finally(() => setLoadingCount(false));
  }, [selectedKey]);

  async function handleSend() {
    setSending(true);
    setResult(null);
    setError('');

    try {
      const res = await fetch('/api/v1/admin/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ announcementKey: selectedKey }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message ?? 'Erro ao enviar anúncio.');
        return;
      }

      setResult(data as BroadcastResult);
      // Update count after successful send
      setRecipientCount(0);
    } catch {
      setError('Erro inesperado ao enviar anúncio.');
    } finally {
      setSending(false);
    }
  }

  const selected = ANNOUNCEMENTS.find((a) => a.key === selectedKey);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading text-lg">Anúncios</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Anúncio</label>
          <Select value={selectedKey} onValueChange={setSelectedKey}>
            <SelectTrigger className="rounded-xl">
              <SelectValue placeholder="Selecione um anúncio" />
            </SelectTrigger>
            <SelectContent>
              {ANNOUNCEMENTS.map((a) => (
                <SelectItem key={a.key} value={a.key}>
                  {a.heroTitle}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selected && (
          <div className="text-sm text-muted-foreground space-y-1">
            <p>
              <span className="font-medium">Assunto:</span> {selected.subject}
            </p>
            <p>
              <span className="font-medium">Destinatários pendentes:</span>{' '}
              {loadingCount ? 'Carregando...' : (recipientCount ?? '—')}
            </p>
          </div>
        )}

        {error && (
          <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg">
            {error}
          </p>
        )}

        {result && (
          <div className="text-sm bg-green-50 border border-green-200 px-3 py-2 rounded-lg space-y-1">
            <p className="font-medium text-green-800">Envio concluído</p>
            <p className="text-green-700">
              Enviados: {result.sent} · Falhas: {result.failed} · Total:{' '}
              {result.total}
            </p>
          </div>
        )}

        <Dialog>
          <DialogTrigger asChild>
            <Button
              disabled={sending || recipientCount === 0}
              className="gradient-brand text-white rounded-xl font-semibold hover:opacity-90 transition-smooth"
            >
              {sending ? 'Enviando...' : 'Enviar anúncio'}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar envio</DialogTitle>
              <DialogDescription>
                Esta ação enviará o anúncio{' '}
                <strong>&ldquo;{selected?.heroTitle}&rdquo;</strong> para{' '}
                <strong>{recipientCount ?? '—'} destinatários</strong>. Não é
                possível desfazer.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" className="rounded-xl">
                  Cancelar
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button
                  onClick={handleSend}
                  className="gradient-brand text-white rounded-xl font-semibold"
                >
                  Confirmar envio
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
