import { useUpsertValidationStore } from '@/store/upsertValidationStore';
import { ChangeEventHandler, Dispatch, SetStateAction } from 'react';
type FormTitleInputProps = {
  title: string;
  setTitle: Dispatch<SetStateAction<string>>;
};

const FormTitleInput = ({ title, setTitle }: FormTitleInputProps) => {
  const { isValidTitle, setIsValidTitle } = useUpsertValidationStore();
  const handleTitleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setTitle(event.currentTarget.value);
    event.currentTarget.value.length === 0 ? setIsValidTitle(false) : setIsValidTitle(true);
  };

  return (
    <div>
      <label
        className={`block mb-2 ${isValidTitle === false ? 'text-red' : 'text-gray-900'} text-subtitle3 md:text-h5 font-bold`}
        htmlFor="title"
      >
        제목
      </label>
      <input
        className={`md:max-h-[51px] px-4 md:px-6 py-2 md:py-3 w-full text-neutral-900 border rounded-lg text-body3 md:rounded-xl md:text-body1  focus:border-main-400 outline-none ${isValidTitle === false ? 'placeholder:text-red border-red ' : 'text-gray-900 border-neutral-100 placeholder:text-neutral-400 placeholder:text-body3 md:placeholder:text-body1'} `}
        type="text"
        name="title"
        id="title"
        maxLength={50}
        placeholder="제목을 입력해 주세요"
        value={title}
        onChange={handleTitleChange}
      />
    </div>
  );
};

export default FormTitleInput;
