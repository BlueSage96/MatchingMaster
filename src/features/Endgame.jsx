import confetti from 'https://cdn.skypack.dev/canvas-confetti';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ButtonSound from '../shared/ButtonSound';
import EndgameStyle from '../css/modules/Endgame.module.css';
import Edit from '../assets/edit.png';

function Endgame({playerName, setPlayerName}) {
  const navigate = useNavigate();
  const location = useLocation();
    const playerHistory = JSON.parse(localStorage.getItem('matchStats')) || [];
  const { player, score } = location.state || {};
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(playerName);

  const handleGameSelect = (option) => {
     if (option == "Play Again") {
        navigate("/match");
     }

     if (option == "Main Menu") {
        navigate("/");
     }
  }

  function handleCancel() {
      setEditedName(playerName);
      setIsEditing(false);
  }

  function handleEdit(event) {
     setEditedName(event.target.value);
  }

  function handleUpdate(event) {
    event.preventDefault();
    if (!editedName) return;
    setIsEditing(false);
    setPlayerName(editedName);
  }

  useEffect(() => {
    confetti();
    setEditedName(playerName);
  },[playerName]);

  return (
    <>
      <h1>Game Over!</h1>
      <div className={EndgameStyle.leaderboard}>
         <div className={EndgameStyle.statsInfo}>
             <h2 style={{marginRight: "20px", textDecoration: "underline"}}>Player Name</h2> 
             <h2 style={{textDecoration: "underline"}}>Score</h2>
         </div>
         
        {isEditing ? (
          <>
          <input type="text"
            value={editedName}
            onChange={handleEdit} />

            <ButtonSound type="button" className={EndgameStyle.Btn} onClick={handleUpdate}>Update</ButtonSound>
            <ButtonSound type="button" className={EndgameStyle.Btn} onClick={handleCancel}>Cancel</ButtonSound>
          </>        
        ) : (
          <div className={EndgameStyle.statsInfo}>
            <span style={{display: "flex", alignItems: "center", marginRight: "100px"}}>
              <ButtonSound style={{marginLeft: 8}}
              className={EndgameStyle.EditBtnWrapper} onClick={() => setIsEditing(true)}>
               <img className={EndgameStyle.EditBtn} src={Edit} alt="Edit icon" />
            </ButtonSound>
            <span>{playerName || 'Unknown'} </span>
              <span style={{marginLeft: 8}}>:</span>
          </span>
          <span style={{alignSelf: "center"}}>{score ?? 'N/A'}</span>
          
         </div>
        )}
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
