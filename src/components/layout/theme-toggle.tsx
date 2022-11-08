import { useTheme } from 'next-themes';
import { HiOutlineMoon, HiOutlineSun } from 'react-icons/hi';
import { ClientOnly } from '../client-only';
import { Toggle } from '../ui/toggle';

/**
 * Component for easy theme switching
 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  // Clean and good looking implementation of a switch (link is for vue.js -> small changes)
  // https://medium.com/front-end-weekly/build-a-html-toggle-switch-in-just-7-lines-of-code-using-vue-tailwindcss-ed215394fcd
  // Also added icons depending on the state
  return (
    <ClientOnly>
      <Toggle
        isLeft={theme !== 'light'}
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        leftIcon={<HiOutlineSun className="h-6 w-6" />}
        rightIcon={<HiOutlineMoon className="text-primary h-6 w-6" />}
      />
    </ClientOnly>
  );
}
