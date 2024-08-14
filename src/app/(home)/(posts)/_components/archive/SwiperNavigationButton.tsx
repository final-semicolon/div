import CarouselLeftHover from '@/assets/images/common/CarouselLeftHover';
import CarouselLeft from '@/assets/images/common/CarouselLeft';
import CarouselRightHover from '@/assets/images/common/CarouselRightHover';
import CarouselRight from '@/assets/images/common/CarouselRight';
import { SwiperNavigationButtonProps } from '@/types/posts/archiveTypes';

const SwiperNavigationButton = ({
  direction,
  isHovering,
  onClick,
  onMouseEnter,
  onMouseLeave
}: SwiperNavigationButtonProps) => {
  const isPrev = direction === 'prev';
  const hoverIcon = isPrev ? <CarouselLeftHover /> : <CarouselRightHover />;
  const defaultIcon = isPrev ? <CarouselLeft /> : <CarouselRight />;

  return (
    <div
      className={`absolute top-1/3 transform -translate-y-1/2 ${isPrev ? 'left-[-24px]' : 'right-[-24px]'} z-50`}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <button className="swiper-button-custom">{isHovering ? hoverIcon : defaultIcon}</button>
    </div>
  );
};

export default SwiperNavigationButton;
