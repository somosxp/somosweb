export const Plus = ({
  size = 24,
  color = "black",
}: {
  size?: number;
  color?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_1255_544)">
      <path
        d="M3.75 12H20.25"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 3.75V20.25"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_1255_544">
        <rect width={size} height={size} fill="white" />
      </clipPath>
    </defs>
  </svg>
);
