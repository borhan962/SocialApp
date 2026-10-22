import EmojiPickerReact, { Theme, type EmojiClickData } from 'emoji-picker-react';

export type CommentEmojiProps = {
  className?: string;
  onEmojiClick?: (emoji: EmojiClickData) => void;
  height?: number | string;
  width?: number | string;
};

export function CommentEmoji({
  className,
  onEmojiClick,
  height = 300,
  width = '100%',
}: CommentEmojiProps) {
  return (
    <div className={`w-full shadow-sm rounded-2xl overflow-hidden border border-gray-200 bg-white ${className || ''}`}>
      <EmojiPickerReact
        onEmojiClick={onEmojiClick}
        height={height}
        width={width}
        theme={Theme.LIGHT}
        autoFocusSearch={false}
        searchPlaceholder="Search emoji..."
      />
    </div>
  );
}

export default CommentEmoji;
