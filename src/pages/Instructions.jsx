import { useNavigate } from 'react-router-dom';
import ButtonSound from "../shared/ButtonSound";
import InstStyle from "styled-components";
import GIF from "../assets/MatchingMaster.gif";

function Instructions () {
    const navigate = useNavigate();
    const Instructions = InstStyle.h2 `
       margin: 4px 8px;
    `

    const Panel = InstStyle.div `
      position: relative;
      top: 120px;
      background: rgba(0,0,0,0.3);
      border: 2px solid black;
      border-radius: 8px;
    `
    
    return (
      <>
        <ButtonSound className="backButton" onClick={() => navigate(-1)}>
          &larr; Back
        </ButtonSound>

        <h1 style={{ position: 'absolute', top: '235px' }}>Instructions</h1>

        <Panel>
          <Instructions>
            Choose a matching mode such as color or Marvel characters. Match all
            card pairs to win the game. Use settings to toggle background music as well
            as button and card clicking sounds.
          </Instructions>
          <img src={GIF} alt="Matching Master gif" />
        </Panel>
      
      </>
    );
    
}
export default Instructions;