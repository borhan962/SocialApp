import EmojiPickerReact, { Theme, type EmojiClickData } from 'emoji-picker-react';

export type EmojiPickerProps = {
  className?: string;
  onEmojiClick?: (emoji: EmojiClickData) => void;
  height?: number | string;
  width?: number | string;
  theme?: Theme;
};

export function EmojiPicker({
  className,
  onEmojiClick,
  height = 380,
  width = 320,
  theme = Theme.LIGHT,
}: EmojiPickerProps) {
  return (
    <div className={`shadow-xl rounded-2xl overflow-hidden border border-gray-200 bg-white ${className || ''}`}>
      <EmojiPickerReact
        onEmojiClick={onEmojiClick}
        height={height}
        width={width}
        theme={theme}
        autoFocusSearch={false}
      />
    </div>
  );
}

export default EmojiPicker;
