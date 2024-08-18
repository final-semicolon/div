import Down from '@/assets/images/common/Down';
import SortSetting from '@/assets/images/common/SortSetting';
import SortSetting20X20 from '@/assets/images/common/SortSetting20X20';
import { Default, Mobile } from '@/hooks/common/useMediaQuery';

type DownResponsiveProps = {
  isType?: string;
  stroke: string;
  className?: string;
  options?: string;
};

const OptionsResponsive = ({ isType, className = 'mx-2', stroke, options }: DownResponsiveProps) => {
  return (
    <>
      <Mobile>
        {isType === 'sort' && <SortSetting20X20 stroke={stroke} />}
        <span className={className}>{options}</span>
        <Down width={14} height={14} strokeWidth={1.3} stroke={stroke} />
      </Mobile>
      <Default>
        {isType === 'sort' && <SortSetting stroke={stroke} />}
        <span className={className}>{options}</span>
        <Down strokeWidth={1.5} stroke={stroke} />
      </Default>
    </>
  );
};

export default OptionsResponsive;
