type CommentBubbleProps = {
  stroke?: string;
};

const CommentBubble = ({ stroke = '#0F0F0F' }: CommentBubbleProps) => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12.0013 21C13.9983 20.9997 15.9384 20.3353 17.5162 19.1114C19.0941 17.8874 20.2201 16.1735 20.717 14.2394C21.2138 12.3053 21.0534 10.2608 20.2608 8.42795C19.4682 6.59506 18.0886 5.0778 16.3391 4.11506C14.5896 3.15231 12.5695 2.79875 10.597 3.11004C8.62455 3.42132 6.81159 4.37978 5.44359 5.83452C4.07559 7.28925 3.23026 9.15764 3.04067 11.1455C2.85107 13.1334 3.32799 15.1279 4.39634 16.815L3.00134 21L7.18634 19.605C8.62587 20.5188 10.2963 21.0027 12.0013 21Z"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default CommentBubble;
