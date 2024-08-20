import { Default, Mobile } from '@/hooks/common/useMediaQuery';
import { PostTagsProps } from '@/types/posts/forumTypes';

const PostTags = ({ tags }: PostTagsProps) => (
  <>
    <Default>
      <div className="post-tags mt-2">
        {tags.map((tag) => (
          <div
            key={tag.id}
            className="inline-block border bg-neutral-50 border-neutral-50 m-1 flex-wrap max-h-[40px] overflow-hidden"
          >
            <span
              className="inline-block text-subtitle2 font-medium text-neutral-700 px-1 whitespace-nowrap"
              style={{ maxWidth: '100%' }}
            >
              #{tag.tag}
            </span>
          </div>
        ))}
      </div>
    </Default>
    <Mobile>
      <div className="post-tags mt-5">
        {tags.map((tag) => (
          <div
            key={tag.id}
            className="inline-block border bg-neutral-50 border-neutral-50 mr-[6px] flex-wrap rounded min-h-[26px] overflow-hidden"
          >
            <span
              className="inline-block text-caption2 font-regular text-neutral-700 px-1 whitespace-nowrap"
              style={{ maxWidth: '100%' }}
            >
              #{tag.tag}
            </span>
          </div>
        ))}
      </div>
    </Mobile>
  </>
);

export default PostTags;
