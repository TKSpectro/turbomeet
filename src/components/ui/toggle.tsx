import * as RToggle from '@radix-ui/react-toggle';

interface Props extends RToggle.ToggleProps {
  childOn: React.ReactNode;
  childOff: React.ReactNode;
}

export function Toggle({ childOn, childOff, ...props }: Props) {
  return (
    <RToggle.Root
      className="flex h-9 w-9 items-center justify-center rounded-md bg-white hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600"
      {...props}
    >
      {props.pressed ? childOn : childOff}
    </RToggle.Root>
  );
}
