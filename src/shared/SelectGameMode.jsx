import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ButtonSound from '../context/ButtonSound';
import SGMStyle from '../css/modules/SGM.module.css';
import GameLogo from '../assets/GameLogo.png';
import Character from '../assets/character.png';
import Comic from '../assets/comic.png';
import Cats from '../assets/cats.png';
import Dogs from '../assets/dogs.png';
import Start from '../assets/start.png';

function SelectGameMode() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectMode, setSelectMode] = useState(null);

  const isMarvel = location.pathname === '/marvelMatchMode';
  const isAnimals = location.pathname === '/animals';

  const options = isMarvel ? [
        { key: 'characters', img: Character, alt: 'Marvel character match button' },
        { key: 'comic', img: Comic, alt: 'Marvel comic match button' }
      ] : isAnimals ? [
        { key: 'cats', img: Cats, alt: 'Cat match button' },
        { key: 'dogs', img: Dogs, alt: 'Dog match button' }
      ] : [];

  const navState = isMarvel ? { mode: 'marvel', marvelMode: selectMode } :
     isAnimals ? { mode: 'animals', animalMode: selectMode } :
    {};

  return (
    <>
      <div className={SGMStyle.menuUI}>
        <img className={SGMStyle.Logo} src={GameLogo} alt="Matching Master Logo" draggable="false" />
      </div>

      <div className={SGMStyle.ModeDiv}>
        {options.map((opt) => (
          <ButtonSound
            key={opt.key} invisible className={`${SGMStyle.CharModeBtn} ${SGMStyle[opt.key] || ''}`}
            onClick={() => setSelectMode(opt.key)}>
            <img className={`${SGMStyle.characters} ${SGMStyle[opt.key]}`} src={opt.img} alt={opt.alt} />
          </ButtonSound>
        ))}
      </div>

      <div className={SGMStyle.StartContainer}>
        <ButtonSound
          invisible
          className={SGMStyle.StartBtn}
          onClick={() => {
            if (selectMode) navigate('/match', { state: navState });
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
