import DateCard from './date-card';

export interface DateCardDetailsProps {
  start: Date;
  end?: Date;
}

const DateCardDetails = ({ start, end }: DateCardDetailsProps) => {
  return (
    <>
      <DateCard date={start} />
      {end && (
        <div>
          <div className="relative -mr-2 inline-block pr-2 text-right text-xs font-semibold after:absolute after:top-2 after:right-0 after:h-4 after:w-1 after:border-t after:border-r after:border-b after:border-gray-300 after:content-['']">
            <div>{start.toLocaleTimeString()}</div>
            <div className="text-gray-600 dark:text-gray-400">{end.toLocaleTimeString()}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default DateCardDetails;
