'use client';
import { MouseEventHandler, useEffect, useState } from 'react';
import { TeditArchiveData, TeditForumData, TeditQnaData, TpostFormData } from '@/types/upsert';
import { BOARD_LIST, CATEGORY_LIST_EN, CATEGORY_LIST_KR, LOGIN_ALERT } from '@/constants/upsert';
import FormTitleInput from '../FormTitleInput';
import FormTagInput from './editform/FormTagInput';
import FormContentArea from '../FormContentArea';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import FormSubmitButton from '../FormSubmitButton';
import { useAuth } from '@/context/auth.context';
import BackArrowIcon from '@/assets/images/upsert_image/BackArrowIcon';
import ThumbNailBox from '../ThumbNailBox';
import { usePostingCategoryStore } from '@/store/postingCategoryStore';
import EditCategoryBox from './editform/categorybox/EditCategoryBox';
import { TAG_LIST } from '@/constants/tags';
import { revalidatePostTag } from '@/actions/revalidatePostTag';
import { deleteThumbnail, patchThumbnail, uploadThumbnail } from '../../_utils/thumbnail';
import { useUpsertValidationStore } from '@/store/upsertValidationStore';
import { POST_EDIT_ALERT_TEXT } from '@/constants/alert';
import MobileBackIconBlack from '@/assets/images/upsert_image/MobileBackIconBlack';
import { useQueryClient } from '@tanstack/react-query';
import { revalidate } from '@/actions/revalidate';

type UpsertFormProps = {
  data: TeditForumData | TeditQnaData | TeditArchiveData;
  path: string;
};

const EditForm = ({ data, path }: UpsertFormProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { me: user } = useAuth();
  const { categoryGroup, subCategory, setCategoryGroup, setSubCategory, clearCategory } = usePostingCategoryStore();
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [prevUrl, setPrevUrl] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagList, setTagList] = useState<Array<Ttag>>(TAG_LIST);
  const [isThumbnailUrlDeleted, setisThumbnailUrlDeleted] = useState<boolean>(false);
  const [thumbnail, setThumbnail] = useState<File>();
  const [FORUM, QNA, ARCHIVE] = BOARD_LIST;
  const { setIsValidTitle, setIsValidContent, clearAllValid } = useUpsertValidationStore();

  const handleSubmit = async (): Promise<void> => {
    const category = CATEGORY_LIST_EN[CATEGORY_LIST_KR.indexOf(categoryGroup.category)];

    // 폼 유효성 검사 로직
    // const isForumSubCategory = FORUM_SUB_CATEGORY_LIST.find((FORUM_SUB_CATEGORY) => subCategory === FORUM_SUB_CATEGORY);

    const validArray = [title, content];
    const invalidSequance = [() => setIsValidTitle(false), () => setIsValidContent(false)];

    const invalidCheckArray = validArray.map((valid, index) => {
      if (valid.length === 0) {
        invalidSequance[index]();
        return 'invalid';
      }
      return 'valid';
    });

    invalidCheckArray.forEach((isInvalid, index) => {
      isInvalid === 'invalid' && index !== 1 ? window.scrollTo({ top: 0, behavior: 'smooth' }) : null;
    });

    if (invalidCheckArray.includes('invalid')) {
      return;
    }

    const postData: TpostFormData = {
      title,
      user_id: user?.id as string,
      content: content,
      category,
      forum_category: subCategory
    };

    //썸네일 상태 검사 로직
    const thumbnailUrl =
      !prevUrl && thumbnail
        ? await uploadThumbnail(thumbnail, category)
        : prevUrl && !thumbnail
          ? await deleteThumbnail(thumbnail!, category, prevUrl)
          : isThumbnailUrlDeleted
            ? await patchThumbnail(thumbnail!, category, prevUrl, isThumbnailUrlDeleted)
            : null;

    //유효성 검사 통과시 업데이트 요청
    const response = await fetch(path, {
      method: 'PATCH',
      body: JSON.stringify({
        ...postData,
        path,
        thumbnail: thumbnailUrl,
        tags: tagList.filter((tag) => tag.selected),
        user_id: user?.id
      })
    });
    const { data, message } = await response.json();

    if (!data) {
      toast.error(message);
      return;
    }

    if (category === 'forum') {
      await queryClient.invalidateQueries({ queryKey: ['forumPosts'] });
      await queryClient.invalidateQueries({ queryKey: ['myPosts'] });
      await revalidatePostTag(`forum-detail-${data[0].id}`);
    } else if (category === 'qna') {
      await queryClient.invalidateQueries({ queryKey: ['qnaPosts'] });
      await queryClient.invalidateQueries({ queryKey: ['myPosts'] });
      await revalidatePostTag(`qna-detail-${data[0].id}`);
    } else if (category === 'archive') {
      await queryClient.invalidateQueries({ queryKey: ['archivePosts'] });
      await queryClient.invalidateQueries({ queryKey: ['myPosts'] });
      await revalidate('/', 'layout');
    }
    await revalidatePostTag(`${path}`);
    router.push(`/${category}/${data[0].id}`);
    toast.success(POST_EDIT_ALERT_TEXT);
    clearAllValid();
    return;
  };

  const handleBackClick: MouseEventHandler<HTMLDivElement> = () => {
    router.back();
  };

  useEffect(() => {
    if (!data) {
      return;
    } else if (!user) {
      router.push(`/login`);
      toast.error(LOGIN_ALERT);
    } else if (data.user_id !== user?.id) {
      router.push(`/`);
      toast.error('권한이 없습니다!');
      return;
    }

    switch (data.category) {
      case 'forum':
        setCategoryGroup(FORUM);
        setSubCategory((data as TeditForumData).forum_category);
        (data as TeditForumData).forum_tags.length !== 0
          ? setTags((data as TeditForumData).forum_tags.map((tag) => tag.tag ?? ''))
          : null;
        setTitle(data.title);
        setContent(data.content);
        setPrevUrl(data.thumbnail ?? '');
        break;
      case 'qna':
        setCategoryGroup(QNA);
        (data as TeditQnaData).qna_tags.length !== 0
          ? setTags((data as TeditQnaData).qna_tags.map((tag) => tag.tag ?? ''))
          : null;
        setTitle(data.title);
        setContent(data.content);
        setPrevUrl(data.thumbnail ?? '');
        break;
      case 'archive':
        setCategoryGroup(ARCHIVE);
        (data as TeditArchiveData).archive_tags.length !== 0
          ? setTags((data as TeditArchiveData)?.archive_tags.map((tag) => tag.tag ?? ''))
          : null;
        setTitle(data.title);
        setContent(data.content);
        setPrevUrl(data.thumbnail ?? '');
        break;
    }
    return () => {
      clearCategory();
    };
  }, [data, user]);

  useEffect(() => {
    setTagList(
      TAG_LIST.map((TAG) => {
        return tags.includes(TAG.name) ? { ...TAG, selected: !TAG.selected } : TAG;
      })
    );
  }, [tags]);

  return (
    <div className="max-w-full px-5 md:px-0 md:max-w-[1204px] mx-auto flex flex-col  max-h-screen ">
      <div className="w-6 h-6 mb-6 md:hidden" onClick={handleBackClick}>
        <MobileBackIconBlack />
      </div>
      <div className="w-9 h-9 md:mb-14 hidden md:block" onClick={handleBackClick}>
        <BackArrowIcon />
      </div>
      <form className="flex flex-col gap-y-10 h-full">
        <EditCategoryBox />
        <FormTitleInput title={title} setTitle={setTitle} />
        <FormTagInput tagList={tagList} setTagList={setTagList} />
        <ThumbNailBox
          prevUrl={prevUrl}
          setisThumbnailUrlDeleted={setisThumbnailUrlDeleted}
          setThumbnail={setThumbnail}
        />
        <FormContentArea content={content} setContent={setContent} />
        <FormSubmitButton handleSubmit={handleSubmit} isEdit={true} />
      </form>
    </div>
  );
};

export default EditForm;
