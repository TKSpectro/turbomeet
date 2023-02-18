import clsx from 'clsx';
import dayjs from 'dayjs';
import * as React from 'react';

export interface DateCardProps {
  date: Date;
  annotation?: React.ReactNode;
  className?: string;
}

export const getDateProps = (date: Date) => {
  const d = dayjs(date);
  return {
    day: d.format('D'),
    dow: d.format('ddd'),
    month: d.format('MMM'),
  };
};

const DateCard: React.FunctionComponent<DateCardProps> = ({ annotation, className, date }) => {
  const { day, dow, month } = getDateProps(date);
  return (
    <div
      className={clsx(
        'relative mt-1 inline-block h-14 w-14 rounded-md border border-gray-300 bg-gray-100 text-center shadow-md shadow-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:shadow-gray-700',
        className,
      )}
    >
      {annotation && <div className="absolute -top-3 -right-3 z-20">{annotation}</div>}
      <div className="relative -mt-2 mb-[-1px] text-xs font-medium text-gray-800 dark:text-gray-100">
        <span className="relative z-10 inline-block px-1 after:absolute after:left-0 after:top-[7px] after:-z-10 after:inline-block after:w-full after:content-['']">
          {dow.substring(0, 3)}
        </span>
      </div>
      <div className="-mb-1 text-center text-lg text-primary">{day}</div>
      <div className="text-center text-xs font-semibold uppercase text-gray-700 dark:text-gray-300">
        {month}
      </div>
    </div>
  );
};

export default DateCard;
