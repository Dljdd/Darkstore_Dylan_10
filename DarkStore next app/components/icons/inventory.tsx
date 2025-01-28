import { LucideProps } from "lucide-react";

export default function InventoryIcon(props: LucideProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M2 7.5h20l-2 12.5H4L2 7.5Z" />
      <path d="M2 7.5l2-5h16l2 5" />
      <path d="M6 10l1 7" />
      <path d="M18 10l-1 7" />
    </svg>
  );
}
