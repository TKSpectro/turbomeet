import clsx from 'clsx';
interface Props {
  isRight: boolean;
  onClick: () => void;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  big?: boolean;
}

/**
 * Custom toggle component
 * @param isRight the current state of the switch
 * @param onClick a function which gets called when the switch was clicked
 * @param leftIcon a ReactNode which contains the icon which gets shown on the left side
 * @param rightIcon a ReactNode which contains the icon which gets shown on the right side
 * @param big if true will scale the switch up by 14px/1.5rem
 */
export function Switch({ isRight, onClick, leftIcon, rightIcon, big }: Props) {
  return (
    <div className="float-left items-center" onClick={() => onClick()}>
      <div
        className={clsx(
          'items-center rounded-full bg-gray-300 p-1 dark:bg-gray-800',
          { 'bg-gray-400 dark:bg-gray-700': isRight === true },
          { 'h-8 w-14': !big },
          { 'h-10 w-16': big },
        )}
      >
        <div
          className={clsx(
            'transform rounded-full bg-white shadow-md duration-200 ease-out dark:bg-gray-900',
            { 'translate-x-6': isRight === true },
            { 'h-6 w-6': !big },
            { 'h-8 w-8': big },
          )}
        >
          {isRight === false ? leftIcon : rightIcon}
        </div>
      </div>
    </div>
  );
}
