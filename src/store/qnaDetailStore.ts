import { create } from 'zustand';

type TuseQnaDetailStore = {
  postId: string;
  postUser: string;
  selectedComment: string;
  commentPage: number;
  setPostId: (postId: string) => void;
  setPostUser: (postUser: string) => void;
  setSelectedComment: (selectedComment: string) => void;
  setCommentPage: (page: number) => void;
  clearQnaDetail: () => void;
};

export const useQnaDetailStore = create<TuseQnaDetailStore>((set) => ({
  postId: '',
  postUser: '',
  selectedComment: '',
  commentPage: 1,
  setPostId: (postId) => set({ postId }),
  setPostUser: (postUser) => set({ postUser }),
  setSelectedComment: (selectedComment) => set({ selectedComment: selectedComment }),
  setCommentPage: (page) => set({ commentPage: page }),
  clearQnaDetail: () => set({ postId: '', selectedComment: '' })
}));
