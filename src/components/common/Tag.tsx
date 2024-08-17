import { cva } from 'class-variance-authority';
import '@/app/globals.css';
import { ComponentProps } from 'react';

const largeTagVarients = cva(['text-caption3', 'md:text-subtitle2', 'font-medium', 'text-center', 'rounded'], {
  variants: {
    intent: {
      primary: ['bg-main-400', 'text-white', 'px-1', 'py-[2px]', 'md:py-1', 'md:px-3']
    }
  },
  compoundVariants: [
    {
      intent: 'primary'
    }
  ],
  defaultVariants: {
    intent: 'primary'
  }
});

type TagProps = ComponentProps<'div'> & {
  label: string;
  intent: 'primary';
};

function Tag({ label, intent }: TagProps) {
  return <div className={largeTagVarients({ intent })}>{label}</div>;
}

export default Tag;
