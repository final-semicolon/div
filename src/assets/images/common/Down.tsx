type DownProps = {
  width?: number;
  height?: number;
  stroke?: string;
};

const Down = ({ width = 24, height = 24, stroke = '#292929' }: DownProps) => {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M18 9L12.1414 14.8586C12.0633 14.9367 11.9367 14.9367 11.8586 14.8586L6 9"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default Down;
