import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MenuStyle from '../css/modules/Menu.module.css';
import GameLogo from '../assets/GameLogo.png';
import Color from '../assets/color.png';
import Marvel from '../assets/marvel.png';
import Start from '../assets/start.png';
import ButtonSound from '../shared/ButtonSound';

function Menu() {
    // const navigate = useNavigate();
    const [selectMode, setSelectMode] = useState(null);
    // const [hasMusicStarted, setHasMusicStarted] = useState(null);

    const handleSelectMode = (mode) => {
      setSelectMode(mode);
    };
    
    return (
        <>
            <div className={MenuStyle.menuUI}>

            </div>
        </>
    )
}
export default Menu;
