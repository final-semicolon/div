type TagBlockProps = { tag: string };

const TagBlock = ({ tag }: TagBlockProps) => {
  return (
    <span className="md:text-subtitle2 text-caption2 md:font-medium gap-1 text-neutral-700 bg-neutral-50 md:px-3 py-1 px-2 rounded ">
      {'#' + tag}
    </span>
  );
};

export default TagBlock;
