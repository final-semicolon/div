import { create } from 'zustand';

type TuseQnaDetailStore = {
  postId: string;
  postUser: string;
  seletedComment: string;
  commentPage: number;
  setPostId: (postId: string) => void;
  setPostUser: (postUser: string) => void;
  setSeletedComment: (seletedComment: string) => void;
  setCommentPage: (page: number) => void;
  clearQnaDetail: () => void;
};

export const useQnaDetailStore = create<TuseQnaDetailStore>((set) => ({
  postId: '',
  postUser: '',
  seletedComment: '',
  commentPage: 1,
  setPostId: (postId) => set({ postId }),
  setPostUser: (postUser) => set({ postUser }),
  setSeletedComment: (seletedComment) => set({ seletedComment }),
  setCommentPage: (page) => set({ commentPage: page }),
  clearQnaDetail: () => set({ postId: '', seletedComment: '' })
}));
