import Down from '@/assets/images/common/Down';
import { Default, Mobile } from '@/hooks/common/useMediaQuery';

type DownResponsiveProps = {
  stroke: string;
};

const DownResponsive = ({ stroke }: DownResponsiveProps) => {
  return (
    <>
      <Mobile>
        <Down width={14} height={14} strokeWidth={1.3} stroke={stroke} />
      </Mobile>
      <Default>
        <Down strokeWidth={1.5} stroke={stroke} />
      </Default>
    </>
  );
};

export default DownResponsive;
