import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MenuStyle from '../css/modules/Menu.module.css';
import GameLogo from '../assets/GameLogo.png';
import Color from '../assets/color.png';
import Marvel from '../assets/marvel.png';
import Pokémon from '../assets/pokémon.png';
import Animals from '../assets/animals.png';
import Start from '../assets/start.png';
import ButtonSound from '../context/ButtonSound';

function Menu() {
  const navigate = useNavigate();
  const [selectMode, setSelectMode] = useState(null);

  const handleSelectMode = (mode) => {
    setSelectMode(mode);
  };

  return (
    <>
      <div className={MenuStyle.menuUI}>
        <img className={MenuStyle.Logo} src={GameLogo} alt="Matching Master Logo" draggable="false" />

        <div className={MenuStyle.ModeDiv}>
          <ButtonSound invisible className={MenuStyle.ColModeBtn} onClick={() => handleSelectMode('color')}>
            <img className={MenuStyle.Color} src={Color} alt="Color mode button" />
          </ButtonSound>

          <ButtonSound invisible className={MenuStyle.MarModeBtn} onClick={() => navigate('/marvelMatchMode')}>
            <img className={MenuStyle.Marvel} src={Marvel} alt="Marvel mode button" />
          </ButtonSound>

          <ButtonSound invisible className={MenuStyle.AniModeBtn} onClick={() => navigate('/animals', {
            state: {mode: 'animals'}
          })}>
            <img className={MenuStyle.Animals} src={Animals} alt="Animals mode button"/>
          </ButtonSound>

          <ButtonSound invisible className={MenuStyle.PokéModeBtn} onClick={() => handleSelectMode('pokémon')}>
            <img className={MenuStyle.Pokémon} src={Pokémon} alt="Pokémon matching button"/>
          </ButtonSound>
        </div>

        <div className={MenuStyle.StartContainer}>
          <ButtonSound
            invisible
            className={MenuStyle.StartBtn}
            onClick={() => {
              if (selectMode) navigate('/match', { state: { mode: selectMode } });
            }}
          >
            <img
              className={MenuStyle.Start}
              src={Start}
              alt="Start game button"
              style={{
                opacity: selectMode ? 1 : 0.4,
                cursor: selectMode ? 'pointer' : 'not-allowed',
                pointerEvents: selectMode ? 'auto' : 'none'
              }}
            />
          </ButtonSound>
        </div>
      </div>
    </>
  );
}
export default Menu;
