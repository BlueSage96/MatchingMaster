// Global sound for button clicks
import { useSound } from '../context/SoundProvider';
import ButtonClick from '../assets/ButtonClick.wav';

export default function ButtonSound({
  onClick,
  children,
  className = '',
  invisible,
  style,
  ...props
}) {
  const { buttonSoundEnabled } = useSound();
  const audio = new Audio(ButtonClick);

  const handleClick = (event) => {
    if (buttonSoundEnabled) {
      audio.currentTime = 0;
      audio.play();
    }
    if (onClick) onClick(event);
  };
  return (
    <button
      onClick={handleClick}
      {...props}
      className={`buttonSound ${className}`}
      style={
        invisible
          ? {
              background: 'none',
              border: 'none',
              outline: 'none',
              cursor: 'pointer',
              ...style,
            }
          : style
      }
    >
      {children}
    </button>
  );
}