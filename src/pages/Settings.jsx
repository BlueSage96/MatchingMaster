import { useNavigate } from 'react-router-dom';
import { useSound } from '../context/SoundProvider';
import SettingStyles from '../css/modules/Settings.module.css';
import ButtonSound from '../shared/ButtonSound';
import CardSound from '../assets/CardFlip.mp3';

function Settings() {
    const navigate = useNavigate();
  return (
    <>
      <ButtonSound className="backButton" onClick={() => navigate(-1)}>&larr; Back</ButtonSound>
      <h1 style={{ fontSize: '60px', position: 'absolute', top: '230px' }}>
        Settings here
      </h1>
    </>
  );
}
export default Settings;
