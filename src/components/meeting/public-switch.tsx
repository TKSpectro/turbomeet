import * as Switch from '@radix-ui/react-switch';
import clsx from 'clsx';

interface Props {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  isForm?: boolean;
  className?: string;
}

export const PublicSwitch = ({
  checked,
  onCheckedChange,
  isForm = false,
  className = '',
}: Props) => {
  return (
    <div className={clsx('flex items-center', className, { 'ml-2 mb-3': isForm })}>
      <label
        className={clsx('pr-[15px] text-[15px] leading-none text-gray-900 dark:text-gray-100', {
          'text-md font-semibold': isForm,
        })}
        htmlFor="public-switch"
      >
        Public voting enabled
      </label>
      <Switch.Root
        className="relative h-[25px] w-[42px] cursor-pointer rounded-full border-2 border-gray-500 bg-gray-100 outline-none data-[state=checked]:bg-gray-300 dark:bg-gray-800 dark:data-[state=checked]:bg-gray-900"
        id="public-switch"
        checked={checked}
        onCheckedChange={onCheckedChange}
      >
        <Switch.Thumb className="block h-[21px] w-[21px] translate-x-0.5 rounded-full bg-gray-700 transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19px] dark:bg-white" />
      </Switch.Root>
    </div>
  );
};
