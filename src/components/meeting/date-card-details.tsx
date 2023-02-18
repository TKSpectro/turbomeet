import * as React from 'react';
import DateCard from './date-card';

export interface DateCardDetailsProps {
  value: string;
  className?: string;
}

const DateCardDetails: React.FunctionComponent<DateCardDetailsProps> = ({ value, className }) => {
  const start = new Date(value.split('/')[0] || '');
  const endDate = value.split('/')[1];
  const end = endDate ? new Date(endDate) : undefined;

  return (
    <>
      <DateCard date={start} />
      {end && (
        <div>
          <div className="relative -mr-2 inline-block pr-2 text-right text-xs font-semibold after:absolute after:top-2 after:right-0 after:h-4 after:w-1 after:border-t after:border-r after:border-b after:border-gray-300 after:content-['']">
            <div>{start.toLocaleTimeString()}</div>
            <div className="text-gray-400">{end.toLocaleTimeString()}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default DateCardDetails;
