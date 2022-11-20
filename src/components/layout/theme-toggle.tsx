import { MoonIcon, SunIcon } from '@radix-ui/react-icons';
import { useTheme } from 'next-themes';
import { ClientOnly } from '../client-only';
import { Toggle } from '../ui';
/**
 * Component for easy theme switching
 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <ClientOnly>
      <Toggle
        aria-label="Toggle theme"
        pressed={theme !== 'light'}
        onPressedChange={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        childOn={<MoonIcon className="h-6 w-6" />}
        childOff={<SunIcon className="h-6 w-6" />}
      />
    </ClientOnly>
  );
}
