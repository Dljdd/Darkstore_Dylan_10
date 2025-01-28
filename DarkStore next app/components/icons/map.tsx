import { IconProps } from '@/types/icon'

const Map = ({ selected, ...props }: IconProps) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M15 6L21 3V18L15 21M15 6L9 3M15 6V21M9 3L3 6V21L9 18M9 3V18M9 18L15 21"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export default Map
