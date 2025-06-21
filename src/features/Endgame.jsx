import confetti from 'https://cdn.skypack.dev/canvas-confetti';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ButtonSound from '../shared/ButtonSound';
import EndgameStyle from '../css/modules/Endgame.module.css';
import Edit from '../assets/edit.png';

function Endgame({playerName}) {
  const navigate = useNavigate();
  const playerHistory = JSON.parse(localStorage.getItem('matchStats')) || [];
  const [editedName, setEditedName] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [history, setHistory] = useState(playerHistory);

  const handleGameSelect = (option) => {
     if (option === "Play Again") {
        navigate("/match");
     }
     if (option === "Main Menu") {
        navigate("/");
     }
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
          <h2 style={{marginRight: '20px', textDecoration: 'underline'}}>Player Stats</h2>
        </div>

        <div className={EndgameStyle.statsInfo}>
          <div>
            {history.map((entry, idx) => {
               //Fallback to empty string/zero if missing
               const player = entry?.player ?? '';
               const score = entry?.score ?? 0;
               return (
                  <div key={player + score + idx} style={{display: "flex", alignItems: "center", marginBottom: 16}}>
                      {editingIndex === idx ? (
                        <>
                          <input type="text" value={editedName} onChange={(event) => setEditedName(event.target.value)}
                          style={{marginRight: 0}} />
                            <ButtonSound className={Endgame.Btn} onClick={() => {
                               const updated = [...history];
                               updated[idx] = {
                                  ...updated[idx],
                                  player: editedName,
                               };
                               setHistory(updated);
                               localStorage.setItem('matchStats', JSON.stringify(updated));
                               setEditingIndex(null);
                            }} >Update</ButtonSound>
                            <ButtonSound className={EndgameStyle.Btn} onClick={() => setEditingIndex(null)}>Cancel</ButtonSound>
                        </>
                      ): (
                         <>
                            <ButtonSound className={EndgameStyle.EditBtnWrapper} style={{marginRight: 8}}
                            onClick={() => {
                                setEditingIndex(idx);
                                setEditedName(player);
                            }}>
                              <img className={EndgameStyle.EditBtn} src={Edit} alt="Edit icon"/>
                            </ButtonSound>
                            <span style={{marginRight: 40}}>{player}: </span>
                            <span>{score}</span>
                         </>
                      )}

                  </div>
               )
            })}
          </div>
        </div>
      </div>

      <div>
         <ButtonSound onClick={() => handleGameSelect("Play Again")}
            style={{marginRight: 40}}
         >Play Again</ButtonSound>
         <ButtonSound onClick={() => handleGameSelect("Main Menu")}>Main Menu</ButtonSound>
      </div>
    </>
  )
}
export default Endgame;
