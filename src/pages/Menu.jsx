import { useState } from 'react';
import { useNavigate } from 'react-router';
import MenuStyle from '../css/modules/Menu.module.css';
import GameLogo from '../assets/GameLogo.png';
import Gear from '../assets/settings.png';
import Info from '../assets/instructions.png';
import Color from '../assets/color.png';
import Marvel from '../assets/marvel.png';
import Start from '../assets/start.png';
import ButtonSound from '../shared/ButtonSound';

function Menu ({playMusic}) {
    const navigate = useNavigate();
    const [selectMode, setSelectMode] = useState(null);
    
    // Choosing the game mode
    const handleSelectMode = (mode) => {
        setSelectMode(mode);
    }

    return (
        <>
            <div className={MenuStyle.menuUI}
            
            >
                <p>Placeholder text</p>
                {/* Settings and instructions */}
                <div>
                    
                </div>
                
            </div>
        </>
    )
}
export default Menu;
