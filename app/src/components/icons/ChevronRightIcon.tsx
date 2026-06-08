interface Props {
  size?: number;
  className?: string;
}

/** 向右箭头（chevron-right），用于下一条等场景 */
export default function ChevronRightIcon({ size = 24, className }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}
