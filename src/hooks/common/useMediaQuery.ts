import { ReactNode } from 'react';
import { useMediaQuery } from 'react-responsive';

type ResponsiveProps = {
  children: ReactNode;
};

export const Desktop = ({ children }: ResponsiveProps) => {
  const isDesktop = useMediaQuery({ minWidth: 1152 });
  return isDesktop ? children : null;
};

export const NotDesktop = ({ children }: ResponsiveProps) => {
  const isNotDesktop = useMediaQuery({ maxWidth: 1151 });
  return isNotDesktop ? children : null;
};

export const Tablet = ({ children }: ResponsiveProps) => {
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1151 });
  return isTablet ? children : null;
};

export const Mobile = ({ children }: ResponsiveProps) => {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  return isMobile ? children : null;
};

export const Default = ({ children }: ResponsiveProps) => {
  const isNotMobile = useMediaQuery({ minWidth: 768 });
  return isNotMobile ? children : null;
};
