export type NavLinksProps = {
  getLinkClasses: (path: string) => string;
};

export type UserMenuProps = {
  isLoggedIn: boolean;
  userData: {
    profile_image?: string | null;
  } | null;
};

export type DesktopHeaderProps = {
  getLinkClasses: (path: string) => string;
  isLoggedIn: boolean;
  userData: any;
};
