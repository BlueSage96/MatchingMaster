import { useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { useSound } from '../context/SoundContext';
import SettingsStyle from '../css/modules/Settings.module.css';
import ButtonSound from '../context/ButtonSound';
import ButtonClick from '../assets/ButtonClick.wav';
import CardClick from '../assets/CardFlip.mp3';
import BackgroundMusic from '../context/BackgroundMusic';
import Volume from "../context/VolumeSlider";

function Settings() {
  const navigate = useNavigate();
  const {buttonSoundEnabled, setButtonSoundEnabled, buttonVolume, setButtonVolume,
    cardSoundEnabled, setCardSoundEnabled, cardVolume, setCardVolume,
    bgSoundEnabled, setBGSoundEnabled, bgVolume, setBGVolume} = useSound();

  const bgSongRef = useRef(null);

  useEffect(() => {
     setBGSoundEnabled(false);
  }, [setBGSoundEnabled]);

  useEffect(() => {
     if (bgSongRef.current && typeof bgVolume === "number" && isFinite(bgVolume) && bgVolume >=0 && bgVolume <= 100) {
       bgSongRef.current.volume = bgVolume / 100;
     }
  },[bgVolume]);

  const playSoundWithGain = (audioFile, volume) => {
    const context = new (window.AudioContext || window.webkitAudioContext)();
    const source = context.createBufferSource();
    const gainNode = context.createGain();
    fetch(audioFile)
    .then(response => response.arrayBuffer())
    .then(arrayBuffer => context.decodeAudioData(arrayBuffer))
    .then(audioBuffer => {
       source.buffer = audioBuffer;
       source.connect(gainNode);
       //Amplify if volume > 50
       const gainValue = volume > 50 ? (volume / 50) : (volume / 100);
       gainNode.gain.value = gainValue;
       gainNode.connect(context.destination);
       source.start(0);
       source.onended = () => context.close();
    })
  }

  return (
    <>
      <BackgroundMusic bgSoundEnabled={bgSoundEnabled} bgSongRef={bgSongRef} />
      <ButtonSound className={SettingsStyle.backButton} onClick={() => navigate(-1)}>
        &larr; Back
      </ButtonSound>
      <h1>Settings</h1>
      <div className={SettingsStyle.Main}>
        <div className={SettingsStyle.Sound}>
          <span>Button Sound:</span>
          {buttonSoundEnabled && (
            <Volume volume={buttonVolume} setVolume={setButtonVolume}/>)}
          <button
            className={SettingsStyle.Off}
            onClick={() => {
              const newState = !buttonSoundEnabled;
              if (newState) {
                playSoundWithGain(ButtonClick, buttonVolume);
              }
              setButtonSoundEnabled((prev) => !prev);
            }}
            style={{ backgroundColor: buttonSoundEnabled ? 'green' : 'red' }}
          >
            {buttonSoundEnabled ? 'ON' : 'OFF'}
          </button>
        </div>
        <hr className={SettingsStyle.Line} />
        <div className={SettingsStyle.Sound}>
          <span>Card Sound:</span>
          {cardSoundEnabled && (
            <Volume volume={cardVolume} setVolume={setCardVolume} />
          )}
          <button
            className={SettingsStyle.Off}
            onClick={() => {
              const newState = !cardSoundEnabled;
              setCardSoundEnabled(newState);
              if (newState) {
                playSoundWithGain(CardClick, cardVolume);
              }
            }}
            style={{ backgroundColor: cardSoundEnabled ? 'green' : 'red' }}
          >
            {cardSoundEnabled ? 'ON' : 'OFF'}
          </button>
        </div>

        <hr className={SettingsStyle.Line} />
        <div className={SettingsStyle.Sound}>
          <span>Background Music:</span>
          {bgSoundEnabled && (
            <Volume volume={bgVolume} setVolume={setBGVolume}/>
          )}
          <button
            className={SettingsStyle.Off}
            onClick={() => {
              const newState = !bgSoundEnabled;
              setBGSoundEnabled(newState);
              if (newState && bgSongRef.current) {
                bgSongRef.current.currentTime = 0;
                bgSongRef.current.play();
              } else if (bgSongRef.current) {
                bgSongRef.current.pause();
              }
            }}
            style={{ backgroundColor: bgSoundEnabled ? 'green' : 'red' }}
          >
            {bgSoundEnabled ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>
    </>
  );
}
export default Settings;
