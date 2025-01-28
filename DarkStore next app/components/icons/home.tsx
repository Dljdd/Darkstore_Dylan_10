import clsx from 'clsx';
import React from 'react';

type Props = { selected: boolean };

const Account = ({ selected }: Props) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2ZM9 7C9 5.34315 10.3431 4 12 4C13.6569 4 15 5.34315 15 7C15 8.65685 13.6569 10 12 10C10.3431 10 9 8.65685 9 7Z"
        className={clsx(
          'dark:group-hover:fill-[#C8C7FF] transition-all dark:fill-[#353346] fill-[#C0BFC4] group-hover:fill-[#7540A9]',
          { 'dark:!fill-[#C8C7FF] !fill-[#7540A9] ': selected }
        )}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 14C8.68629 14 6 16.6863 6 20V22H18V20C18 16.6863 15.3137 14 12 14ZM8 20C8 17.7909 9.79086 16 12 16C14.2091 16 16 17.7909 16 20V20.5H8V20Z"
        className={clsx(
          'dark:group-hover:fill-[#9F54FF] transition-all dark:fill-[#C0BFC4] fill-[#5B5966] group-hover:fill-[#BD8AFF]',
          { 'dark:!fill-[#9F54FF] fill-[#BD8AFF]': selected }
        )}
      />
    </svg>
  );
};

export default Account;
