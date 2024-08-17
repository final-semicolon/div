type DownProps = {
  width?: number;
  height?: number;
  stroke?: string;
  strokeWidth?: number;
};

const Down = ({ width = 24, height = 24, stroke = '#292929', strokeWidth = 1.5 }: DownProps) => {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M13 1L7.14142 6.85858C7.06332 6.93668 6.93668 6.93668 6.85858 6.85858L1 0.999999"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  );
};

export default Down;
