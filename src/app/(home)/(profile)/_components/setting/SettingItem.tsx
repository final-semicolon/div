import Right24X24 from '@/assets/images/common/Right24X24';
import React, { useEffect, useRef, useState } from 'react';

interface SettingItemProps {
  label: string;
  value?: string;
  onClick?: () => void;
}

const SettingItem = ({ label, value, onClick }: SettingItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isClamped, setIsClamped] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const updateClampedState = () => {
      if (textRef.current) {
        const { scrollHeight, clientHeight } = textRef.current;
        if (scrollHeight > clientHeight) {
          setIsClamped(true);
        } else {
          setIsClamped(false);
        }
      }
    };
    updateClampedState();
    window.addEventListener('resize', updateClampedState);
    return () => {
      window.removeEventListener('resize', updateClampedState);
    };
  }, [value]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      {label !== '자기소개' ? (
        <div className=" md:mt-4" onClick={onClick}>
          <div className="flex justify-between p-[16px_0] border-b border-neutral-50">
            <span className="text-neutral-900 text-subtitle2 md:text-subtitle1 md:font-medium">{label}</span>
            <div className="flex cursor-pointer">
              <span className="text-neutral-500 md:text-neutral-800 text-body2 md:text-body1 md:font-regular ">
                {value}
              </span>
              {onClick && (
                <div className="w-6 h-6 mt-[1px] center-alignment ">
                  <Right24X24 />
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <>
          <div onClick={onClick} className="flex justify-between p-[16px_0]">
            <span className="text-neutral-900 text-subtitle2 md:text-subtitle1 font-medium">{label}</span>
            <div className="w-6 h-6 mt-[1px] center-alignment ">
              <Right24X24 />
            </div>
          </div>
          <p
            ref={textRef}
            className={`text-neutral-500 md:text-neutral-700 md:w-full text-body2 md:text-body1 font-regular whitespace-pre-wrap break-words ${!isExpanded ? 'line-clamp-5' : ''}`}
          >
            {value}
          </p>
          {isClamped && (
            <button onClick={toggleExpand} className="text-neutral-700 text-subtitle3 md:text-body1 mt-2">
              {isExpanded ? '접기' : '... 더보기'}
            </button>
          )}
        </>
      )}
    </>
  );
};

export default SettingItem;
