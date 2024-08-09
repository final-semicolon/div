import Right from '@/assets/images/common/Right';
import React from 'react';

interface DetailItemProps {
  label: string;
  value?: string;
  onClick?: () => void;
}

const DetailItem = ({ label, value, onClick }: DetailItemProps) => {
  return (
    <>
      {label !== '자기소개' ? (
        <>
          <div className="flex justify-between p-[16px_0] cursor-pointer" onClick={onClick}>
            <span className="text-neutral-900 text-subtitle1 font-medium">{label}</span>
            <div className="flex">
              <span className="text-neutral-800 text-body1 font-regular">{value}</span>
              {onClick && (
                <div className="mt-1 ml-3">
                  <Right width={10} height={18} />
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <>
          <div onClick={onClick} className="flex justify-between p-[16px_0]">
            <span className="text-neutral-900 text-subtitle1 font-medium">{label}</span>
            <div className="mt-[5px] cursor-pointer">
              <Right width={10} height={18} />
            </div>
          </div>
          <p className="text-neutral-700 h-[135px] text-body1 font-regular line-clamp-5 whitespace-pre-wrap ">
            {value}
          </p>
        </>
      )}
      <p className="border-b border-neutral-50 " />
    </>
  );
};

export default DetailItem;
