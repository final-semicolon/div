'use client';
import { MouseEventHandler, useState } from 'react';
import { TpostFormData } from '@/types/upsert';
import FormTitleInput from '../FormTitleInput';
import FormTagInput from './postingform/FormTagInput';
import FormContentArea from '../FormContentArea';
import { CATEGORY_LIST_EN, CATEGORY_LIST_KR, FORUM_SUB_CATEGORY_LIST, LOGIN_ALERT } from '@/constants/upsert';
import { toast } from 'react-toastify';
import FormSubmitButton from '../FormSubmitButton';
import { useAuth } from '@/context/auth.context';
import { useRouter } from 'next/navigation';
import BackArrowIcon from '@/assets/images/upsert_image/BackArrowIcon';
import { usePostingCategoryStore } from '@/store/postingCategoryStore';
import PostingCategoryBox from './postingform/PostingCategoryBox';
import UpsertTheme from '../UpsertTheme';
import ThumbNailBox from '../ThumbNailBox';
import { TAG_LIST } from '@/constants/tags';
import { uploadThumbnail } from '../../_utils/thumbnail';
import { useUpsertValidationStore } from '@/store/upsertValidationStore';
import { POST_ALERT_TEXT } from '@/constants/alert';
import MobileBackIconBlack from '@/assets/images/upsert_image/MobileBackIconBlack';
import { useQueryClient } from '@tanstack/react-query';
import Loading from '@/app/(home)/loading';

const PostingForm = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { categoryGroup, subCategory, clearCategory } = usePostingCategoryStore();
  const { me: user } = useAuth();
  const [title, setTitle] = useState<string>('');
  const [tagList, setTagList] = useState<Array<Ttag>>(TAG_LIST);
  const [thumbnail, setThumbnail] = useState<File>();
  const [content, setContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { setIsValidCategory, setIsValidContent, setIsValidTitle, clearAllValid } = useUpsertValidationStore();

  if (!user?.id) {
    router.push(`/login`);
    toast.error(LOGIN_ALERT);
    return;
  }

  const handleSubmit = async (): Promise<void> => {
    setIsLoading(true);
    const category = CATEGORY_LIST_EN[CATEGORY_LIST_KR.indexOf(categoryGroup.category ?? '')];

    // 폼 유효성 검사 로직
    const isForumSubCategory = FORUM_SUB_CATEGORY_LIST.find((FORUM_SUB_CATEGORY) => subCategory === FORUM_SUB_CATEGORY);

    const validArray = [category, title, content];
    const invalidSequance = [
      () => setIsValidCategory(false),
      () => setIsValidTitle(false),
      () => setIsValidContent(false)
    ];

    const invalidCheckArray = validArray.map((valid, index) => {
      if ((index === 0 && !valid) || (valid === 'forum' && !isForumSubCategory)) {
        invalidSequance[index]();
        return 'invalid';
      } else if (valid.trim().length === 0) {
        invalidSequance[index]();
        return 'invalid';
      }
      return 'valid';
    });

    invalidCheckArray.forEach((isInvalid, index) => {
      isInvalid === 'invalid' && index !== 2 ? window.scrollTo({ top: 0, behavior: 'smooth' }) : null;
    });

    if (invalidCheckArray.includes('invalid')) {
      setIsLoading(false);
      return;
    }

    const postData: TpostFormData = {
      title: title,
      user_id: user?.id,
      content: content,
      category,
      forum_category: subCategory
    };

    // 유효성 검사 통과시 업로드 썸네일-글-태그순서로 업로드

    const thumbnailUrl = thumbnail ? await uploadThumbnail(thumbnail, category) : null;

    const response = await fetch('/api/upsert/posting', {
      method: 'POST',
      body: JSON.stringify({ ...postData, thumbnailUrl })
    });
    const { data, message } = await response.json();
    const tagsArray = tagList.filter((tag) => tag.selected === true);
    if (tagsArray.length > 0 && !!data[0].id) {
      const response = await fetch(`/api/upsert/tags/${data[0].id}`, {
        method: 'POST',
        body: JSON.stringify({ user_id: user.id, tags: tagsArray, category: data[0].category })
      });
    }

    if (category === 'forum') {
      await queryClient.invalidateQueries({ queryKey: ['forumPosts'] });
      await queryClient.invalidateQueries({ queryKey: ['myPosts'] });
    } else if (category === 'qna') {
      await queryClient.invalidateQueries({ queryKey: ['qnaPosts'] });
      await queryClient.invalidateQueries({ queryKey: ['myPosts'] });
    } else if (category === 'archive') {
      await queryClient.invalidateQueries({ queryKey: ['archivePosts'] });
      await queryClient.invalidateQueries({ queryKey: ['myPosts'] });
    }

    router.push(`/${category}/${data[0].id}`);
    toast.success(POST_ALERT_TEXT);
    clearCategory();
    clearAllValid();
    return;
  };

  const handleBackClick: MouseEventHandler<HTMLDivElement> = () => {
    router.back();
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="max-w-full px-5 md:px-0 md:max-w-[1204px] mx-auto flex flex-col  max-h-screen ">
      <div className="w-6 h-6 mb-6 md:hidden" onClick={handleBackClick}>
        <MobileBackIconBlack />
      </div>
      <div className="w-9 h-9 md:mb-14 hidden md:block" onClick={handleBackClick}>
        <BackArrowIcon />
      </div>
      <UpsertTheme />
      <form className="w-full md:max-w-full flex flex-col gap-y-10 h-full ">
        <PostingCategoryBox />
        <FormTitleInput title={title} setTitle={setTitle} />
        <FormTagInput tagList={tagList} setTagList={setTagList} />
        <ThumbNailBox setThumbnail={setThumbnail} />
        <FormContentArea content={content} setContent={setContent} />
        <FormSubmitButton handleSubmit={handleSubmit} isEdit={false} />
      </form>
    </div>
  );
};

export default PostingForm;
