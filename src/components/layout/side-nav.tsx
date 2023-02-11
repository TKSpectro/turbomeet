import clsx from 'clsx';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { FiGithub } from 'react-icons/fi';
import { HiOutlineMenuAlt3, HiOutlineX } from 'react-icons/hi';
import { Button } from '../ui/button';
import { CmdK } from './cmdk';
import { ThemeToggle } from './theme-toggle';

export function SideNav() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  return (
    <aside className="sticky top-0 flex w-full flex-shrink-0 flex-col bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200 md:h-screen md:w-64">
      <div className="flex flex-shrink-0 flex-row items-center justify-between px-8 py-4">
        <Link
          href="/"
          className="focus:shadow-outline rounded-lg text-lg font-semibold uppercase tracking-widest text-gray-900 focus:outline-none dark:text-white"
        >
          turbomeet
        </Link>
        <Button
          className="focus:shadow-outline rounded-lg focus:outline-none md:hidden"
          onClick={() => setOpen(!open)}
        >
          <svg fill="currentColor" viewBox="0 0 20 20" className="h-6 w-6">
            {!open && <HiOutlineMenuAlt3 className="h-6 w-6 text-gray-800" />}
            {open && <HiOutlineX className="h-6 w-6 text-gray-800" />}
          </svg>
        </Button>
      </div>

      <CmdK />

      <nav
        className={clsx('flex-grow px-4 pb-4 md:block md:overflow-y-auto md:pb-0', {
          block: open,
          hidden: !open,
        })}
      >
        {session && (
          <>
            <NavLink href="/dashboard">Dashboard</NavLink>
            <NavLink href="/meeting">Meeting</NavLink>
            <NavLink href="/components">Components</NavLink>
            <NavLink href="/profile">Profile</NavLink>
          </>
        )}
        {!session && (
          <>
            <NavLink href="/meeting">Meeting</NavLink>
            <NavLink href="/auth/login">Login</NavLink>
          </>
        )}
      </nav>
      <div
        className={clsx(
          'bottom-0 w-full border-t border-gray-500 py-4 px-8 md:absolute md:block md:px-4',
          {
            block: open,
            hidden: !open,
          },
        )}
      >
        <div className="flex items-center justify-between">
          <ThemeToggle />
          <Link href="https://github.com/TKSpectro/turbomeet" className="">
            <FiGithub className="float-right h-7 w-7" />
          </Link>
        </div>
      </div>
    </aside>
  );
}

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

function NavLink({ href, children }: NavLinkProps) {
  const router = useRouter();
  const isCurrentRoute = router.route === href || router.route.startsWith(`${href}`);

  return (
    <Link
      href={href}
      className={clsx(
        'focus:shadow-outline mt-2 block rounded-lg px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-200 hover:text-gray-900 focus:bg-gray-200 focus:text-gray-900 focus:outline-none dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:bg-gray-600 dark:focus:text-white',
        {
          'bg-transparent': !isCurrentRoute,
          'dark: bg-gray-200 dark:bg-gray-900': isCurrentRoute,
        },
      )}
    >
      {children}
    </Link>
  );
}
