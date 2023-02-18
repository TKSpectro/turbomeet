import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as React from 'react';
import { HiOutlineMenu, HiOutlineTrash } from 'react-icons/hi';

export interface AppointmentDropdownProps {
  removeAppointment: () => void;
}

const AppointmentDropdown: React.FunctionComponent<AppointmentDropdownProps> = ({
  removeAppointment,
}) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className="inline-flex h-6 w-6 items-center justify-center rounded-full "
          aria-label="Open date options"
        >
          <HiOutlineMenu className="h-6 w-6 text-gray-800 dark:text-gray-200" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content className="text-md min-w-[220px] rounded-md border border-gray-500 bg-gray-100 p-2 leading-none dark:border-gray-200 dark:bg-gray-800">
          {/* <DropdownMenu.Item className="mb-2 flex items-center">
            <HiOutlineSparkles className="h-6 w-6 text-gray-800 dark:text-gray-200" />
            Apply all dates
          </DropdownMenu.Item> */}

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
