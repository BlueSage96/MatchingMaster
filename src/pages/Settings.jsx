import { useNavigate } from 'react-router-dom';
import { useSound } from '../context/SoundProvider';
import SettingsStyle from '../css/modules/Settings.module.css';
import ButtonSound from '../shared/ButtonSound';
import ButtonClick from '../assets/ButtonClick.wav';
import CardSound from '../assets/CardFlip.mp3';

function Settings() {
  const navigate = useNavigate();
  const {buttonSoundEnabled, setButtonSoundEnabled, cardSoundEnabled, setCardSoundEnabled} = useSound();
  const audio = new Audio(ButtonClick);
  audio.preload = 'auto';
  return (
    <>
      <ButtonSound className="backButton" onClick={() => navigate(-1)}>&larr; Back</ButtonSound>
      <h1>Settings</h1>
      <div className={SettingsStyle.Main}>
        <div className={SettingsStyle.Sound}>
            <span>Button Sound:</span>
            <button className={SettingsStyle.Off}
              onClick={() => {
                  const newState = !buttonSoundEnabled;
                  if (newState) {
                     audio.currentTime = 0;
                     audio.play();
                  }
                  setButtonSoundEnabled(prev => !prev);
              }}
              style={{backgroundColor: buttonSoundEnabled ? "green" : "red"}}
            >{buttonSoundEnabled ? "ON" : "OFF"}</button>
        </div>
        <hr className={SettingsStyle.Line}/>
        <div className={SettingsStyle.Sound}>
              <span>Card Sound:</span>
              <button className={SettingsStyle.Off}
                onClick={() => {
                    const newState = !cardSoundEnabled;
                    setCardSoundEnabled(newState);
                    if (newState) {
                       const audio = new Audio(CardSound);
                       audio.play();
                    }
                }} style={{backgroundColor: cardSoundEnabled ? "green" : "red"}}
              >{cardSoundEnabled ? "ON" : "OFF"}</button>
        </div>

        
      </div>
    </>
  );
}
export default Settings;
