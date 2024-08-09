import X from '@/assets/images/common/X';
import ImageIcon from '@/assets/images/upsert_image/ImageIcon';
import SadIcon from '@/assets/images/upsert_image/SadIcon';
import Chip from '@/components/common/Chip';
import Image from 'next/image';
import ClipLoader from 'react-spinners/ClipLoader';

import {
  ChangeEventHandler,
  Dispatch,
  DragEventHandler,
  MouseEventHandler,
  SetStateAction,
  useEffect,
  useRef,
  useState
} from 'react';

type ThumbNailBoxProps = {
  prevUrl?: string | null;
  setisThumbnailUrlDeleted?: Dispatch<SetStateAction<boolean>>;
  setThumbnail: Dispatch<SetStateAction<File | undefined>>;
};

const ThumbNailBox = ({ prevUrl, setisThumbnailUrlDeleted, setThumbnail }: ThumbNailBoxProps) => {
  const thumbnailInput = useRef<HTMLInputElement>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
  const [thumbnailName, setThumbnailName] = useState<string>('');
  const [isValidSize, setIsValidSize] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const MAX_SIZE = 50 * 1024 * 1024; //50MB 사이즈 제한

  const handleThumbnailChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    if (!event.target.files) return;
    setIsLoading(true);
    if (event.target.files[0].size > MAX_SIZE) {
      setIsValidSize(false);
      setIsLoading(false);
      setThumbnail(undefined);
      return;
    } else if (!event.target.files[0].type.includes('image')) {
      setIsValidSize(false);
      setIsLoading(false);
      return;
    }
    setIsValidSize(true);
    if (event.target.files?.length === 0) return;
    else if (event.target.files) {
      setThumbnail(event.target.files[0]);
      setThumbnailName(event.target.files[0].name);
      setisThumbnailUrlDeleted ? setisThumbnailUrlDeleted(true) : null;
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setThumbnailPreview(reader.result);
        }
      };
    }
  };

  const handleInputClick: MouseEventHandler = () => {
    thumbnailInput.current?.click();
  };

  const handleDragOver: DragEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();
  };

  const handleDrop: DragEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();
    if (!event.dataTransfer) {
      return;
    } else if (event.dataTransfer.files[0].size > MAX_SIZE) {
      setIsValidSize(false);
      setIsLoading(false);
      setThumbnail(undefined);
      return;
    } else if (event.dataTransfer.files[0].name === thumbnailName) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setIsValidSize(true);

    if (event.dataTransfer.files.length > 0) {
      thumbnailInput.current ? (thumbnailInput.current.files = event.dataTransfer.files) : null;
      setisThumbnailUrlDeleted ? setisThumbnailUrlDeleted(true) : null;
      setThumbnail(event.dataTransfer.files[0]);
      setThumbnailName(event.dataTransfer.files[0].name);
      const reader = new FileReader();
      reader.readAsDataURL(event.dataTransfer.files[0]);
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setThumbnailPreview(reader.result);
        }
      };
    }
  };

  const handleButtonClick: MouseEventHandler = () => {
    if (thumbnailInput.current) {
      thumbnailInput.current.value = '';
      setThumbnailPreview('');
      setThumbnailName('');
      setisThumbnailUrlDeleted ? setisThumbnailUrlDeleted(true) : null;
      setIsValidSize(true);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (prevUrl) {
      setThumbnailPreview(prevUrl);
      setThumbnailName(prevUrl?.slice(-36));
    }
  }, [prevUrl]);

  return (
    <div className="flex flex-col">
      <input className="hidden" type="file" name="thumbnail" ref={thumbnailInput} onChange={handleThumbnailChange} />
      <h5 className={`block mb-2 ${isValidSize ? 'text-gray-900' : 'text-red'}  text-h5 font-bold `}>썸네일</h5>
      <div
        className={`w-[748px] h-[550px] ${isValidSize ? 'custom-dashed-border' : 'custom-dashed-border-invalid'} shadow-xl flex flex-col items-center justify-center text-neutral-400 rounded-lg ]`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {isLoading ? <div className="w-[748px] h-[550px] bg-white opacity-50 absolute z-10"></div> : null}
        {thumbnailPreview && isValidSize ? (
          <>
            <Image
              className="w-[700px] h-[332px] object-cover rounded-lg mb-10"
              src={thumbnailPreview}
              alt="썸네일 미리보기"
              width={700}
              height={332}
              onClick={handleInputClick}
              onLoad={() => {
                setIsLoading(false);
              }}
            />
            <div className={`w-[700px] h-[56px]  border flex justify-between items-center px-5 py-2 rounded `}>
              <div className="h-[38px] flex items-center gap-[6px] rounded-lg  text-center content-center bg-neutral-50 px-2 py-1 z-20 ">
                <span className="text-neutral-700 text-subtitle2 font-medium"> {thumbnailName}</span>
                {isLoading ? (
                  <ClipLoader size={20} cssOverride={{ borderWidth: '3px' }} color="#423EDF" speedMultiplier={0.85} />
                ) : (
                  <button
                    type="button"
                    className={`${isLoading ? 'hidden' : ''} w-4 h-4 px-1 rounded-full bg-neutral-200`}
                    onClick={handleButtonClick}
                  >
                    <X width={7} height={7} stroke="white" />
                  </button>
                )}
              </div>
              {isLoading ? null : (
                <Chip type="button" intent={'primary'} size="small" label="편집" onClick={handleInputClick} />
              )}
            </div>
          </>
        ) : !isValidSize && !isLoading ? (
          <>
            <div className=" flex justify-center text-center">
              <SadIcon />
            </div>
            <div className="text-center my-10 text-body1 text-neutral-900 font-regular">
              <p>이 파일을 가져올 수 없어요.</p>
              <p>{`(50MB 이하의 이미지 파일만 가능해요)`}</p>
            </div>
            <div className="flex gap-10">
              <Chip type="button" intent={'gray'} size={'large'} label="취소" onClick={handleButtonClick} />
              <Chip type="button" intent={'primary'} size={'large'} label="재업로드" onClick={handleInputClick} />
            </div>
          </>
        ) : (
          <>
            <div className={`flex justify-center text-center`}>
              <ImageIcon />
            </div>
            <div className="text-center my-10">
              <p>썸네일로 설정할 이미지를 불러오세요.</p>
              <p>{`(50MB 이하의 이미지 파일)`}</p>
            </div>
            <Chip type="button" intent={'primary'} size={'large'} label="사진 올리기" onClick={handleInputClick} />
          </>
        )}
      </div>
    </div>
  );
};

export default ThumbNailBox;
