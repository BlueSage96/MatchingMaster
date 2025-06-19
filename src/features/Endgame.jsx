import confetti from 'https://cdn.skypack.dev/canvas-confetti';
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ButtonSound from '../shared/ButtonSound';
import EndgameStyle from '../css/modules/Endgame.module.css';

function Endgame() {
  const navigate = useNavigate();
  const location = useLocation();
  const { player, score } = location.state || {};

  const handleGameSelect = (option) => {
     if (option == "Play Again") {
        navigate("/match");
     }

     if (option == "Main Menu") {
        navigate("/");
     }
  }

  useEffect(() => {
    confetti();
  },[]);

  return (
    <>
      <h1>Game Over!</h1>
      <div className={EndgameStyle.leaderboard}>
         <div className={EndgameStyle.statsInfo}>
             <h2 style={{marginRight: "20px", textDecoration: "underline"}}>Player Name</h2> 
             <h2 style={{textDecoration: "underline"}}>Score</h2>
         </div>
         
         <div className={EndgameStyle.statsInfo}>
            <p style={{marginRight: "100px"}}>{player || 'Unknown'}:</p>
          <p>{score ?? 'N/A'}</p>
         </div>
          
      </div>

      <div>
        <ButtonSound onClick={() => handleGameSelect("Play Again")} 
        style={{marginRight: "40px"}}>Play Again</ButtonSound>

        <ButtonSound onClick={() => handleGameSelect("Main Menu")}>Main Menu</ButtonSound>
      </div>
    </>
  );
}
export default Endgame;
