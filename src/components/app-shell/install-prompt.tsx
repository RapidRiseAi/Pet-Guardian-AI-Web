'use client';

import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

export function InstallPrompt() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
  }, []);

  if (!installEvent || dismissed) return null;

  async function installApp() {
    if (!installEvent) return;
    await installEvent.prompt();
    await installEvent.userChoice;
    setInstallEvent(null);
  }

  return (
    <Card className="mb-6 flex flex-col gap-4 border-primary/25 bg-primary/5 p-4 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="font-semibold">Install PetGuardian AI</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Add the app to your device for quicker access to care records and reminders.
        </p>
      </div>
      <div className="flex gap-2">
        <Button type="button" variant="secondary" onClick={() => setDismissed(true)}>
          Not now
        </Button>
        <Button type="button" onClick={installApp}>
          <Download className="mr-2 size-4" /> Install
        </Button>
      </div>
    </Card>
  );
}
