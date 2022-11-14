import * as Popover from '@radix-ui/react-popover';
import { Command } from 'cmdk';
import { useEffect, useState } from 'react';

export const CommandMenu2 = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: any) => {
      if (e.key === 'k' && e.ctrlKey) {
        e.preventDefault();
        console.log('open', open);
        setOpen((previousOpen) => !previousOpen);
      }
    };

    document.addEventListener('keydown', down);

    return () => document.removeEventListener('keydown', down);
  }, [open]);

  const loading = false;

  return (
    <Popover.Root open={open} onOpenChange={setOpen} modal={true}>
      <Popover.Trigger>open ctrl+k</Popover.Trigger>

      <Popover.Portal>
        <Popover.Content>
          <Command>
            <Command.Input />

            <Command.List>
              {loading && <Command.Loading>Hang on…</Command.Loading>}

              <Command.Empty>No results found.</Command.Empty>

              <Command.Group heading="Fruits">
                <Command.Item>Apple</Command.Item>
                <Command.Item>Orange</Command.Item>
                <Command.Separator />
                <Command.Item>Pear</Command.Item>
                <Command.Item>Blueberry</Command.Item>
              </Command.Group>

              <Command.Item>Fish</Command.Item>
            </Command.List>
          </Command>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};
