import Check from '@/assets/images/common/Check';
import X from '@/assets/images/common/X';
import Chip from '@/components/common/Chip';
import { NICKNAME } from '@/constants/auth';
import { getStyles } from '@/utils/profileStyles';
import { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';

type NicknameModalFlowProps = {
  newNickname: string;
  onNicknameHandler: (e: ChangeEvent<HTMLInputElement>) => void;
  setNewNickname: Dispatch<SetStateAction<string>>;
  handleSave: () => void;
  nicknameMessage: string;
};

const NicknameModalFlow = ({
  newNickname,
  onNicknameHandler,
  setNewNickname,
  handleSave,
  nicknameMessage
}: NicknameModalFlowProps) => {
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const { titleTextColor, conditionTextColor, stroke, borderColor } = getStyles({
    isConditionsNotMetOnBlur: !isFocused && newNickname.length >= NICKNAME.MAX_LENGTH,
    isConditionsMetOnBlur:
      !isFocused && newNickname.length >= NICKNAME.MIN_LENGTH && nicknameMessage === NICKNAME.MATCH,
    isConditionsNotMetOnFocus: newNickname.length >= NICKNAME.MAX_LENGTH || nicknameMessage === NICKNAME.MISMATCH,
    isConditionsMetOnFocus: newNickname.length >= NICKNAME.MIN_LENGTH && nicknameMessage === NICKNAME.MATCH
  });

  const getText = () => {
    if (newNickname.length >= NICKNAME.MAX_LENGTH || nicknameMessage === NICKNAME.MISMATCH) {
      return nicknameMessage;
    }
    if (newNickname.length >= NICKNAME.MIN_LENGTH && nicknameMessage === NICKNAME.MATCH) {
      return nicknameMessage;
    }
    return NICKNAME.RULE;
  };
  return (
    <>
      <div className="flex flex-col items-center">
        <div>
          <h2 className={`mb-2 ${titleTextColor}`}>새로운 닉네임</h2>
          <div
            className={`relative block w-[335px] md:w-[421px] h-[48px] md:h-[56px] p-[12px_16px] md:p-4 border rounded max-w-lg mb-2 mt-2 ${borderColor}`}
          >
            <input
              type="text"
              value={newNickname}
              onChange={onNicknameHandler}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="w-[267px] md:w-[353px] outline-transparent"
              placeholder={NICKNAME.NICKNAME_EDIT_PLACEHOLDER}
            />
            {newNickname && (
              <button
                type="button"
                onClick={() => setNewNickname('')}
                className="absolute right-4 top-4 md:top-5 text-gray-600"
              >
                <X />
              </button>
            )}
          </div>
          <div className="mb-[40px] md:mb-[72px] flex items-center mt-2">
            <Check stroke={stroke} />
            <span className={` ${conditionTextColor}`}>{getText()}</span>
          </div>
        </div>
      </div>
      <div className="flex justify-end mt-4">
        <Chip
          type="button"
          intent={newNickname.length > 1 && newNickname.length <= 12 ? 'primary' : 'primary_disabled'}
          size={'large'}
          label="변경하기"
          onClick={handleSave}
        />
      </div>
    </>
  );
};

export default NicknameModalFlow;
