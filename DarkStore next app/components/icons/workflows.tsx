import clsx from 'clsx'
import React from 'react'

type Props = { selected: boolean }

const ZoneScore = ({ selected }: Props) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        className={clsx(
          'dark:group-hover:stroke-[#C8C7FF] transition-all dark:stroke-[#353346] stroke-[#BABABB] group-hover:stroke-[#7540A9]',
          { 'dark:!stroke-[#C8C7FF] !stroke-[#7540A9] ': selected }
        )}
        strokeWidth="2"
        fill="none"
      />
      <circle
        cx="12"
        cy="12"
        r="6"
        className={clsx(
          'dark:group-hover:fill-[#C8C7FF] transition-all dark:fill-[#353346] fill-[#BABABB] group-hover:fill-[#7540A9]',
          { 'dark:!fill-[#C8C7FF] !fill-[#7540A9] ': selected }
        )}
      />
      <circle
        cx="12"
        cy="12"
        r="2"
        className={clsx(
          'dark:group-hover:fill-[#9F54FF] transition-all dark:fill-[#C0BFC4] fill-[#5B5966] group-hover:fill-[#BD8AFF]',
          { 'dark:!fill-[#9F54FF] fill-[#BD8AFF]': selected }
        )}
      />
    </svg>
  )
}

export default ZoneScore
