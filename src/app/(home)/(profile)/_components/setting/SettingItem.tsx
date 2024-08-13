import Right24X24 from '@/assets/images/common/Right24X24';
import React from 'react';

interface SettingItemProps {
  label: string;
  value?: string;
  onClick?: () => void;
}

const SettingItem = ({ label, value, onClick }: SettingItemProps) => {
  return (
    <>
      {label !== '자기소개' ? (
        <div className=" mt-4  " onClick={onClick}>
          <div className="flex justify-between  p-[16px_0] border-b border-neutral-50">
            <span className="text-neutral-900 text-subtitle1 font-medium">{label}</span>
            <div className="flex cursor-pointer">
              <span className="text-neutral-800 text-body1 font-regular ">{value}</span>
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
          <div onClick={onClick} className="flex justify-between  p-[16px_0]">
            <span className="text-neutral-900 text-subtitle1 font-medium">{label}</span>
            <div className="w-6 h-6 mt-[1px] center-alignment ">
              <Right24X24 />
            </div>
          </div>
          <p className="text-neutral-700 h-[135px] text-body1 font-regular line-clamp-5 whitespace-pre-wrap ">
            {value}
          </p>
        </>
      )}
    </>
  );
};

export default SettingItem;
