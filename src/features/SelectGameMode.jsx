import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ButtonSound from '../shared/ButtonSound';
import SGMStyle from '../css/modules/SGM.module.css';
import GameLogo from '../assets/GameLogo.png';
import Character from '../assets/character.png';
import Comic from '../assets/comic.png';
import Start from '../assets/start.png';

function SelectGameMode() {
    const navigate = useNavigate();
    const [selectMode, setSelectMode] = useState(null);
    const handleSelectMode = (mode) => {
        setSelectMode(mode);
    }
    return (
      <>
       <div className={SGMStyle.menuUI}>
                <img className={SGMStyle.Logo} src={GameLogo} 
                alt="Matching Master Logo" draggable="false" />
            </div>
        <div className={SGMStyle.ModeDiv}>
            <ButtonSound invisible className={SGMStyle.CharModeBtn} onClick={() => handleSelectMode("character")}>
                <img className={SGMStyle.Character} src={Character} alt="Marvel character match mode" />
            </ButtonSound>

            <ButtonSound invisible className={SGMStyle.ComicModeBtn} onClick={() => handleSelectMode("comic")}>
                <img className={SGMStyle.Comic} src={Comic} alt="Marvel comic match mode"/>
            </ButtonSound>
        </div>
        <div className={SGMStyle.StartContainer}>
          <ButtonSound
            invisible
            className={SGMStyle.StartBtn}
            onClick={() => {
              if (selectMode) navigate('/match', { state: { mode: "marvel", marvelMode: selectMode } });
            }}
          >
            <img
              className={SGMStyle.Start}
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
      </>
    );
}
export default SelectGameMode;