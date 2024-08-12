import { create } from 'zustand';

type TuseQnaDetailStore = {
  postId: string;
  postUser: string;
  seletedComment: string;
  setPostId: (postId: string) => void;
  setPostUser: (postUser: string) => void;
  setSeletedComment: (seletedComment: string) => void;
  clearQnaDetail: () => void;
};

export const useQnaDetailStore = create<TuseQnaDetailStore>((set) => ({
  postId: '',
  postUser: '',
  seletedComment: '',
  setPostId: (postId) => set({ postId: postId }),
  setPostUser: (postUser) => set({ postUser: postUser }),
  setSeletedComment: (seletedComment) => set({ seletedComment: seletedComment }),
  clearQnaDetail: () => set({ postId: '', seletedComment: '' })
}));
