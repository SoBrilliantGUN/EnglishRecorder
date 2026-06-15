interface Props {
  size?: number;
  className?: string;
}

/** 向上箭头（chevron-up），用于回到顶部等场景 */
export default function ChevronUpIcon({ size = 24, className }: Props) {
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
      <path d="M18 15l-6-6-6 6" />
    </svg>
  );
}
