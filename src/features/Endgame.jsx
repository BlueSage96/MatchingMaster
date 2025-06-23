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
  const [sortScore, setSortScore] = useState('');

  const handleGameSelect = (option) => {
     if (option === "Play Again") {
        navigate("/match");
     }
     if (option === "Main Menu") {
        navigate("/");
     }
  }

  const sortByScore = (order) => {
    if (order === "HighScore") {
      const sortedScores = [...history].sort((a,b) => b.score - a.score);
      setHistory(sortedScores);
   }
   else if (order === "LowScore") {
      const sortedScores = [...history].sort((a ,b) => a.score - b.score);
      setHistory(sortedScores);
   }
   else {
      const originalSort = JSON.parse(localStorage.getItem('matchStats')) || [];
      setHistory(originalSort);
   }
   setSortScore(order);
 };

  useEffect(() => {
     confetti();
     setEditedName(playerName);
  },[playerName]);

  return (
    <>
      <h1>Game Over!</h1>
      <div className={EndgameStyle.leaderboard}>
        <div className={EndgameStyle.statsInfo}>
          <h2 style={{fontSize: 28, marginLeft: '4px', textDecoration: 'underline'}}>Player Stats</h2>
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
                            <ButtonSound className={EndgameStyle.Btn} onClick={() => {
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
                            <span style={{ width: 50, display: "inline-block", textAlign: "right", marginRight: 40}}>{player}: </span>
                            <span>{score}</span>
                         </>
                      )}

                  </div>
               )
            })}
          </div>
        </div>
         <div style={{padding: 4}}>
            <label htmlFor="sortByScore" style={{textShadow: "1px 1px black", fontSize: 18, padding: "2px 6px"}}>Sort By Score:</label>
            <select id="sortByScore" name="sortByScore" className={EndgameStyle.SortByScore} value={sortScore}
               onChange={(event) => sortByScore(event.target.value)}>
               <option value="default"></option>
               <option value="HighScore">High</option>
               <option value="LowScore">Low</option>
            </select>
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