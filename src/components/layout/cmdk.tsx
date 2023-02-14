import { SlashIcon } from '@radix-ui/react-icons';
import { Command } from 'cmdk';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { HiOutlineSearch } from 'react-icons/hi';
import { trpc } from '../../utils/trpc';

export function CmdK() {
  const router = useRouter();
  const [openCmdK, setOpenCmdK] = useState(false);
  const [search, setSearch] = useState('');
  const { theme, setTheme } = useTheme();

  // Toggle the menu when ⌘K is pressed
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      // Ignore if the target is an input or textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      // User can press ⌘K, Ctrl+K or / to open the menu
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || e.key === '/') {
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

  const { data: meetings } = trpc.meeting.getAllForCmdK.useQuery();

  return (
    <div>
      <div className="relative block">
        <HiOutlineSearch className="pointer-events-none absolute top-1/2 left-3 h-6 w-6 -translate-y-1/2 transform" />
        <SlashIcon className="absolute top-1/2 right-3 h-6 w-6 -translate-y-1/2 rounded-lg border px-1" />
        <input
          type="text"
          className="w-full rounded-md border bg-white p-2 pl-10 pr-10 text-gray-800 focus:border-primary focus:ring-primary dark:bg-gray-900 dark:text-gray-200"
          placeholder="Search..."
          onFocus={() => {
            setOpenCmdK(true);
          }}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
      </div>
      <Command.Dialog
        open={openCmdK}
        onOpenChange={setOpenCmdK}
        label="Global Command Menu"
        className="linear linear-dark fixed top-1/2 left-1/2 z-[9999] max-h-[85vh] w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-md bg-gray-800 p-6 text-gray-100"
        // style={{ background: 'linear-gradient(136.61deg, #27282b 13.72%, #2d2e31 74.3%)' }}
      >
        <Command.Input
          placeholder="Search..."
          className="mb-2 w-full rounded-md border-gray-600 bg-gray-900 p-4 text-white outline-none"
          value={search}
          onValueChange={setSearch}
        />
        <Command.List>
          <Command.Empty>No results found.</Command.Empty>
          <Command.Item
            onSelect={() => {
              handleCmdKRoute('/dashboard');
            }}
          >
            Dashboard / All Meetings...
          </Command.Item>
          <Command.Item
            onSelect={() => {
              handleCmdKRoute('/new-meeting/');
            }}
          >
            Create new meeting...
          </Command.Item>
          {meetings?.map((meeting) => {
            return (
              <Command.Item
                key={meeting.id}
                onSelect={() => {
                  handleCmdKRoute('/meeting/' + meeting.id);
                }}
              >
                Meeting | {meeting.title}
              </Command.Item>
            );
          })}
          <Command.Item
            onSelect={() => {
              handleCmdKRoute('/profile');
            }}
          >
            Profile
          </Command.Item>
          <Command.Item
            onSelect={() => {
              setOpenCmdK(false);
              window.open('https://github.com/TKSpectro/turbomeet', '_blank');
            }}
          >
            Github
          </Command.Item>
          <Command.Item
            onSelect={() => {
              handleCmdKRoute('/imprint');
            }}
          >
            Imprint
          </Command.Item>
          <Command.Item
            onSelect={() => {
              setTheme(theme === 'light' ? 'dark' : 'light');
            }}
          >
            Toggle theme
          </Command.Item>
        </Command.List>
      </Command.Dialog>
    </div>
  );
}
