import Check from '@/assets/images/common/Check';
import Chip from '@/components/common/Chip';
import { INFO } from '@/constants/auth';
import { getStyles } from '@/utils/profileStyles';
import { ChangeEvent, useState } from 'react';

type InfoModalFlowlProps = {
  newInfo: string;
  currentInfo: string;
  onInputHandler: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  validationMessage: string;
  handleSave: () => void;
};
const InfoModalFlow = ({
  newInfo,
  currentInfo,
  onInputHandler,
  validationMessage,
  handleSave
}: InfoModalFlowlProps) => {
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const { titleTextColor, conditionTextColor, stroke, borderColor } = getStyles({
    isConditionsNotMetOnBlur: !isFocused && newInfo.length > INFO.MAX_LENGTH,
    isConditionsMetOnBlur:
      currentInfo === newInfo || (!isFocused && newInfo.length <= INFO.MAX_LENGTH && newInfo.length > 1),
    isConditionsNotMetOnFocus: newInfo.length > INFO.MAX_LENGTH,
    isConditionsMetOnFocus: newInfo.length > 0
  });

  return (
    <>
      <div className="flex flex-col items-center">
        <div>
          <h2 className={`text-subtitle2 font-bold ${titleTextColor}`}>자기소개</h2>
          <textarea
            value={newInfo}
            onChange={onInputHandler}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={INFO.INFO_EDIT_PLACEHOLDER}
            maxLength={INFO.MAX_LENGTH}
            className={`border text-body3 md:text-body1 font-regular rounded-lg p-4 w-[335px] md:w-[421px] h-[167px] my-2 resize-none ${borderColor}`}
          />
          <div className={`flex items-center mb-10 ${conditionTextColor}`}>
            <Check stroke={stroke} />
            <span className="ml-1">
              {validationMessage}
              {newInfo.length > 0 && newInfo.length <= INFO.MAX_LENGTH && (
                <span className="text-neutral-900"> / 150</span>
              )}
            </span>
          </div>
        </div>
      </div>
      <div className="flex justify-end ">
        <Chip
          type="button"
          intent={newInfo.length > 0 && newInfo.length <= INFO.MAX_LENGTH ? 'primary' : 'primary_disabled'}
          size={'large'}
          label="변경하기"
          onClick={handleSave}
        />
      </div>
    </>
  );
};

export default InfoModalFlow;
