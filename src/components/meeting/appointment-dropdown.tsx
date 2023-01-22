import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as React from 'react';
import { HiOutlineMenu, HiOutlineSparkles, HiOutlineTrash } from 'react-icons/hi';

export interface AppointmentDropdownProps {
  removeAppointment: () => void;
}

const AppointmentDropdown: React.FunctionComponent<AppointmentDropdownProps> = ({
  removeAppointment,
}) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        {/* font-family: inherit;
  border-radius: 100%;
  height: 35px;
  width: 35px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--violet11);
  background-color: white;
  box-shadow: 0 2px 10px var(--blackA7); */}
        <button
          className="inline-flex h-6 w-6 items-center justify-center rounded-full "
          aria-label="Open date options"
        >
          <HiOutlineMenu className="h-6 w-6 text-gray-800 dark:text-gray-200" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content className="text-md min-w-[220px] rounded-md bg-slate-800 p-2 leading-none">
          <DropdownMenu.Item className="mb-2 flex items-center">
            <HiOutlineSparkles className="h-6 w-6 text-gray-800 dark:text-gray-200" />
            Apply all dates
          </DropdownMenu.Item>

          <DropdownMenu.Item className="flex items-center" onSelect={removeAppointment}>
            <HiOutlineTrash className="h-6 w-6 text-gray-800 dark:text-gray-200" />
            Delete
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default AppointmentDropdown;
