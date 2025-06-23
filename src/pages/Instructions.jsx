import { useNavigate } from 'react-router-dom';
import ButtonSound from "../shared/ButtonSound";
import InstStyle from '../css/modules/Instructions.module.css';
import GIF from "../assets/MatchingMaster.gif";

function Instructions () {
    const navigate = useNavigate();
    return (
      <>
        <ButtonSound className={InstStyle.backButton} onClick={() => navigate(-1)}>
          &larr; Back
        </ButtonSound>

        <h1 style={{ position: 'absolute', top: '235px', margin: "4px 8px" }}>Instructions</h1>

        <div className={InstStyle.panel}> 
          <h2>
            Choose a matching mode such as color or Marvel characters. Match all
            card pairs to win the game. Use settings to toggle background music as well
            as button and card clicking sounds.
          </h2>
          <img className={InstStyle.GIF} src={GIF} alt="Matching Master gif" />
        </div>
      
      </>
    );
    
}
export default Instructions;