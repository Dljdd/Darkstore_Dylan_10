import clsx from 'clsx'
import React from 'react'

type Props = { selected: boolean }

const WarehouseIcon = ({ selected }: Props) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Warehouse structure */}
      <rect
        x="2"
        y="8"
        width="20"
        height="14"
        className={clsx(
          'dark:group-hover:fill-[#C8C7FF] transition-all dark:fill-[#353346] fill-[#BABABB] group-hover:fill-[#7540A9]',
          { 'dark:!fill-[#C8C7FF] fill-[#7540A9] ': selected }
        )}
      />
      
      {/* Roof (flat roof style) */}
      <rect
        x="1"
        y="6"
        width="22"
        height="3"
        className={clsx(
          'dark:group-hover:fill-[#9F54FF] transition-all dark:fill-[#C0BFC4] fill-[#5B5966] group-hover:fill-[#BD8AFF]',
          { 'dark:!fill-[#7540A9] fill-[#BD8AFF] ': selected }
        )}
      />

      {/* Roll-up door (lines to indicate sections of the door) */}
      <rect
        x="8"
        y="12"
        width="8"
        height="10"
        className={clsx(
          'dark:group-hover:fill-[#9F54FF] transition-all dark:fill-[#C0BFC4] fill-[#5B5966] group-hover:fill-[#BD8AFF]',
          { 'dark:!fill-[#7540A9] fill-[#BD8AFF] ': selected }
        )}
      />
      <line x1="8" y1="15" x2="16" y2="15" stroke="currentColor" strokeWidth="0.5" />
      <line x1="8" y1="18" x2="16" y2="18" stroke="currentColor" strokeWidth="0.5" />
      <line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" strokeWidth="0.5" />
    </svg>
  )
}

export default WarehouseIcon
