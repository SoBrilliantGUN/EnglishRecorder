interface Props {
  size?: number;
  className?: string;
}

/** 向左箭头（chevron-left），用于返回、上一条等场景 */
export default function ChevronLeftIcon({ size = 24, className }: Props) {
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
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}
