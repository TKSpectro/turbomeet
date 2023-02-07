import { Command } from 'cmdk';
import { useRouter } from 'next/router';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';

import { Meta } from './meta';
import { SideNav } from './side-nav';

type Props = {
  children?: ReactNode;
  title?: string;
};

export function Layout({ children }: Props) {
  const router = useRouter();
  const [openCmdK, setOpenCmdK] = useState(false);

  // Toggle the menu when ⌘K is pressed
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpenCmdK((openCmdK) => {
          return !openCmdK;
        });
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const handleCmdKRoute = (route: string) => {
    setOpenCmdK(false);
    router.push(route);
  };

  return (
    <>
      <Meta />
      <Command.Dialog
        open={openCmdK}
        onOpenChange={setOpenCmdK}
        label="Global Command Menu"
        className="linear linear-dark mb- fixed top-1/2 left-1/2 max-h-[85vh] w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-md p-6"
        style={{ background: 'linear-gradient(136.61deg, #27282b 13.72%, #2d2e31 74.3%)' }}
      >
        <Command.Input placeholder="Search..." />
        <Command.List>
          <Command.Empty>No results found.</Command.Empty>

          <Command.Item
            onSelect={() => {
              handleCmdKRoute('/meeting/');
            }}
          >
            Create new meeting...
          </Command.Item>
          <Command.Item
            onSelect={() => {
              handleCmdKRoute('/dashboard');
            }}
          >
            All Meetings...
          </Command.Item>
          <Command.Item
            onSelect={() => {
              handleCmdKRoute('/dashboard');
            }}
          >
            Imprint
          </Command.Item>
          <Command.Item
            onSelect={() => {
              setOpenCmdK(false);
              window.open('https://github.com/TKSpectro/turbomeet', '_blank');
            }}
          >
            Github
          </Command.Item>
        </Command.List>
      </Command.Dialog>

      <div className="w-full flex-col bg-white dark:bg-gray-900 md:flex md:min-h-screen md:flex-row">
        <SideNav />

        <>{children}</>
      </div>
    </>
  );
}
