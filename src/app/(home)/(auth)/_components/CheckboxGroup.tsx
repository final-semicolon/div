'use client';
import CheckBox from '@/assets/images/auth/CheckBox';
import UnCheckBox from '@/assets/images/auth/UnCheckBox';
import React, { useEffect } from 'react';

type CheckboxGroupProps = {
  agreeAll: boolean;
  setAgreeAll: (value: boolean) => void;
  agreeTerms: boolean;
  setAgreeTerms: (value: boolean) => void;
  agreePrivacy: boolean;
  setAgreePrivacy: (value: boolean) => void;
};

const CheckboxGroup = ({
  agreeAll,
  setAgreeAll,
  agreeTerms,
  setAgreeTerms,
  agreePrivacy,
  setAgreePrivacy
}: CheckboxGroupProps) => {
  const handleAgreeAllChange = (checked: boolean) => {
    setAgreeAll(checked);
    setAgreeTerms(checked);
    setAgreePrivacy(checked);
  };

  const handleIndividualChange = (type: string, checked: boolean) => {
    if (type === 'terms') {
      setAgreeTerms(checked);
    } else if (type === 'privacy') {
      setAgreePrivacy(checked);
    }

    if (agreeTerms && agreePrivacy && !checked) {
      setAgreeAll(false);
    } else if (checked && agreeTerms && type === 'privacy') {
      setAgreeAll(true);
    } else if (checked && agreePrivacy && type === 'terms') {
      setAgreeAll(true);
    }
  };

  useEffect(() => {
    if (agreeTerms && agreePrivacy) {
      setAgreeAll(true);
    }
  }, [agreeTerms, agreePrivacy, setAgreeAll]);

  //약관 클릭 시 새로운 창으로 보여주기
  const handleLabelClick = (url: string, e: React.MouseEvent<HTMLLabelElement>) => {
    e.preventDefault();
    window.open(url, '_blank');
  };
  const renderCheckbox = (checked: boolean) => {
    return checked ? <CheckBox /> : <UnCheckBox />;
  };

  return (
    <div className="mb-3 ml-4">
      <div className="subtitle2-bold-16px text-gray-900 mb-3">약관동의</div>
      <div className="p-4 border border-gray-300 rounded">
        <div className="flex items-center mb-3">
          <div className="mr-2" onClick={() => handleAgreeAllChange(!agreeAll)}>
            {renderCheckbox(agreeAll)}
          </div>
          <label htmlFor="agreeAll" className="subtitle2-bold-16px text-gray-900">
            전체동의
          </label>
        </div>
        <hr className="border-gray-300 mb-3" />
        <div className="flex items-center mb-2">
          <div className="mr-2" onClick={() => handleIndividualChange('terms', !agreeTerms)}>
            {renderCheckbox(agreeTerms)}
          </div>
          <label
            htmlFor="agreeTerms"
            className="body2-regular-16px text-gray-600 underline"
            onClick={(e) => handleLabelClick('/legal/terms', e)}
          >
            통합 서비스 이용약관
          </label>
          <span className="body2-regular-16px text-main-400 ml-1">(필수)</span>
        </div>
        <div className="flex items-center mb-2">
          <div className="mr-2" onClick={() => handleIndividualChange('privacy', !agreePrivacy)}>
            {renderCheckbox(agreePrivacy)}
          </div>
          <label
            htmlFor="agreePrivacy"
            className="body2-regular-16px text-gray-600 underline"
            onClick={(e) => handleLabelClick('/legal/privacy', e)}
          >
            개인정보수집 및 이용동의
          </label>
          <span className="body2-regular-16px text-main-400 ml-1">(필수)</span>
        </div>
      </div>
    </div>
  );
};

export default CheckboxGroup;
