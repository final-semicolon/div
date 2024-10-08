import X from '@/assets/images/common/X';

type PasswordFieldProps = {
  value: string;
  onChange: (password: string) => void;
  placeholder: string;
  showPassword: boolean;
  onToggleShowPassword: () => void;
  onClear: () => void;
  color?: string;
  onFocus?: () => void;
  onBlur?: () => void;
};

const PasswordInput = ({
  value,
  onChange,
  placeholder,
  showPassword,
  onToggleShowPassword,
  onClear,
  color = 'border-gray-300',
  onFocus,
  onBlur
}: PasswordFieldProps) => {
  return (
    <div
      className={`relative block w-[335px] md:w-[421px] h-[48px] md:h-[56px] p-[12px_16px] md:p-4 border rounded max-w-lg mb-2 mt-2  ${color}`}
    >
      <input
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-[267px] md:w-[353px] outline-transparent"
        placeholder={placeholder}
        onFocus={onFocus}
        onBlur={onBlur}
      />
      {value && (
        <>
          <button type="button" onClick={onClear} className="absolute right-4 top-4 md:top-5 text-gray-600">
            <X />
          </button>
          <button type="button" onClick={onToggleShowPassword} className="absolute right-12 text-gray-600">
            {showPassword ? '숨기기' : '보기'}
          </button>
        </>
      )}
    </div>
  );
};

export default PasswordInput;
