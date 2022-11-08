import type { ReactNode } from 'react';
import { Meta } from './meta';
import { SideNav } from './side-nav';

type Props = {
  children?: ReactNode;
  title?: string;
};

export function Layout({ children }: Props) {
  return (
    <>
      <Meta />
      <div className="w-full flex-col bg-white dark:bg-gray-900 md:flex md:min-h-screen md:flex-row">
        <SideNav />
        <>{children}</>
      </div>
    </>
  );
}
