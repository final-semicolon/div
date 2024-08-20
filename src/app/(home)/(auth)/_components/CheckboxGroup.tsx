'use client';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import CheckBox from '@/assets/images/auth/CheckBox';
import UnCheckBox from '@/assets/images/auth/UnCheckBox';
import RedI from '@/assets/images/auth/RedI';

type CheckboxGroupProps = {
  showError: boolean;
};

const CheckboxGroup = ({ showError }: CheckboxGroupProps) => {
  const {
    register,
    watch,
    setValue,
    clearErrors,
    formState: { errors }
  } = useFormContext();

  const agreeTerms = watch('terms');
  const agreePrivacy = watch('privacy');

  const renderCheckbox = (checked: boolean) => {
    return checked ? <CheckBox /> : <UnCheckBox />;
  };

  const borderColor = showError && (!agreeTerms || !agreePrivacy) ? 'border-red' : 'border-gray-900';
  const textColor = showError && (!agreeTerms || !agreePrivacy) ? 'text-red' : 'text-gray-900';

  const handleAgreeAll = () => {
    const newCheckedState = !(agreeTerms && agreePrivacy);
    setValue('terms', newCheckedState);
    setValue('privacy', newCheckedState);

    if (newCheckedState) {
      clearErrors(['terms', 'privacy']);
    }
  };

  const handleIndividualCheckboxChange = (field: 'terms' | 'privacy', currentValue: boolean) => {
    const newValue = !currentValue;
    setValue(field, newValue);

    if (newValue) {
      clearErrors([field]);
    }
  };

  return (
    <div>
      <div className={`subtitle2-bold-16px ${textColor} mb-3`}>약관동의</div>
      <div className={`p-4 border rounded ${borderColor}`}>
        <div className="flex items-center mb-3">
          <div className="mr-2 cursor-pointer" onClick={handleAgreeAll}>
            {renderCheckbox(agreeTerms && agreePrivacy)}
          </div>
          <label htmlFor="agreeAll" className="subtitle2-bold-16px text-gray-900 cursor-pointer">
            전체동의
          </label>
        </div>
        <hr className="border-gray-300 mb-3" />
        <div className="flex items-center mb-2">
          <div className="mr-2 cursor-pointer" onClick={() => handleIndividualCheckboxChange('terms', agreeTerms)}>
            {renderCheckbox(agreeTerms)}
          </div>
          <label
            htmlFor="terms"
            onClick={(e) => {
              e.preventDefault();
              window.open('/legal/terms', '_blank');
            }}
            className={`body2-regular-16px underline cursor-pointer text-gray-900`}
          >
            통합 서비스 이용약관 <span className="text-main-400">(필수)</span>
          </label>
          <input
            type="checkbox"
            id="terms"
            {...register('terms', { required: '필수 항목에 동의해 주세요' })}
            className="hidden"
          />
        </div>
        <div className="flex items-center mb-2">
          <div className="mr-2 cursor-pointer" onClick={() => handleIndividualCheckboxChange('privacy', agreePrivacy)}>
            {renderCheckbox(agreePrivacy)}
          </div>
          <label
            htmlFor="privacy"
            onClick={(e) => {
              e.preventDefault();
              window.open('/legal/privacy', '_blank');
            }}
            className={`body2-regular-16px underline cursor-pointer text-gray-900`}
          >
            개인정보수집 및 이용동의 <span className="text-main-400">(필수)</span>
          </label>
          <input
            type="checkbox"
            id="privacy"
            {...register('privacy', { required: '필수 항목에 동의해 주세요' })}
            className="hidden"
          />
        </div>
      </div>
      {showError && (!agreeTerms || !agreePrivacy) && (
        <div className="mt-1 body2-regular-16px text-red flex items-center">
          <RedI />
          필수 항목에 동의해 주세요
        </div>
      )}
    </div>
  );
};

export default CheckboxGroup;
