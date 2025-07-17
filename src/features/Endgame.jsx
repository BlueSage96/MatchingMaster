import confetti from 'https://cdn.skypack.dev/canvas-confetti';
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import ButtonSound from '../context/ButtonSound';
import EndgameStyle from '../css/modules/Endgame.module.css';
import Edit from '../assets/edit.png';

function Endgame({ playerName, setGameTimer }) {
  const navigate = useNavigate();
  const location = useLocation();
  const mode = location.state?.mode || localStorage.getItem('lastMode') || 'color';
  const playerHistory = JSON.parse(localStorage.getItem('matchStats')) || [];

  const [editedName, setEditedName] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [history, setHistory] = useState(playerHistory);
  const [sortScore, setSortScore] = useState('');
  const [editingEntry, setEditingEntry] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const itemsPerPage = 5;
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const totalPages = Math.max(1, Math.ceil(history.length / itemsPerPage));

  const handleGameSelect = (option) => {
    if (option === 'Play Again') {
      if (setGameTimer) setGameTimer(Date.now());
      localStorage.setItem('lastMode', mode);
      navigate('/match', { state: { mode } });
    }
    if (option === 'Main Menu') {
      navigate('/');
    }
  };

  const sortByScore = (order) => {
    if (order === 'HighScore') {
      const sortedScores = [...history].sort((a, b) => b.score - a.score);
      setHistory(sortedScores);
    } else if (order === 'LowScore') {
      const sortedScores = [...history].sort((a, b) => a.score - b.score);
      setHistory(sortedScores);
    } else {
      const originalSort = JSON.parse(localStorage.getItem('matchStats')) || [];
      setHistory(originalSort);
    }
    setSortScore(order);
  };

  //numbers need to be parsed since it's time
  const sortByTime = (order) => {
    //convert time to seconds for sorting
    const parseTime = (t) => {
       if (typeof t === "number") return t;
       if (!t) return 0;
       const [min, sec] = t.split(":").map(Number);
       return min * 60 + sec;
    }
    if (order === "Fastest") {
      const sortedTime = [...history].sort((a,b) => parseTime(a.time) - parseTime(b.time));
      setHistory(sortedTime);
    } else if (order === "Slowest") {
       const sortedTime = [...history].sort((a,b) => parseTime(b.time) - parseTime(a.time));
       setHistory(sortedTime);
    } else {
      const originalSort = JSON.parse(localStorage.getItem("matchStats")) || [];
      setHistory(originalSort);
    }
    setSortScore(order);
  }

  const handlePreviousPage = (page) => {
    if (page > 1) {
      setSearchParams({ page: currentPage - 1 });
    }
  };

  const handleNextPage = (page) => {
    if (page < totalPages) {
      setSearchParams({ page: currentPage + 1 });
    }
  };

  const handleDelete = (relativeIndex) => {
    const absoluteIndex = (currentPage - 1) * itemsPerPage + relativeIndex;
    const updated = history.filter((_, i) => i !== absoluteIndex);
    setHistory(updated);
    localStorage.setItem('matchStats', JSON.stringify(updated));
    //removes 'Update', 'Cancel', and 'Delete' after deleting player info
    setEditingIndex(null);
    setEditingEntry(null);
    const newTotalPages = Math.max(1, Math.ceil(updated.length / itemsPerPage));
    if (currentPage > newTotalPages) {
      setSearchParams({ page: newTotalPages });
    }
  };

  useEffect(() => {
    confetti();
    setEditedName(playerName);
    return () => {};
  }, [playerName]);

  useEffect(() => {
    if (totalPages > 0) {
      if (currentPage < 1 || currentPage > totalPages) {
        navigate('/gameOver');
      }
    }
    return () => {};
  }, [currentPage, totalPages, navigate]);

  useEffect(() => {
    if (location.state?.mode) {
      localStorage.setItem('lastMode', location.state.mode);
    }
    return () => {};
  }, [location.state?.mode]);

  return (
    <>
      <h1>Game Over!</h1>
      <div className={EndgameStyle.leaderboard}>
        <div className={EndgameStyle.statsInfo}>
          <h2 style={{ fontSize: 28, textDecoration: 'underline', margin: "2px" }}>Player Stats</h2>
        </div>

        <div className={EndgameStyle.Titles}>
            <h3 style={{marginRight: 20}}>Name:</h3>
            <h3>Score:</h3>
            <h3>Time:</h3>
        </div>

        <div className={EndgameStyle.statsInfo}>
          <div>
            {history.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((entry, idx) => {
              //Fallback to empty string/zero if missing
              const player = entry?.player ?? '';
              const score = entry?.score ?? 0;
              const time = entry?.time ?? 0;
              return (
                <div
                  key={player + score + time + idx} className={EndgameStyle.StatsRow}>
                  {editingIndex === idx ? (
                    <>
                      <input
                        type="text"
                        value={editedName}
                        onChange={(event) => setEditedName(event.target.value)}
                        style={{ marginRight: 2, padding: "8px 2px", fontSize: 18, textAlign: "center" }}
                      />
                      <ButtonSound
                        className={EndgameStyle.Btn}
                        onClick={() => {
                          const updated = history.map((item) =>
                            item === editingEntry ? { ...item, player: editedName } : item);
                          setHistory(updated);
                          localStorage.setItem('matchStats', JSON.stringify(updated));
                          setEditingIndex(null);
                        }}
                      >
                        Update
                      </ButtonSound>
                      <ButtonSound className={EndgameStyle.Btn} onClick={() => setEditingIndex(null)}>
                        Cancel
                      </ButtonSound>
                      <ButtonSound className={EndgameStyle.Btn} onClick={() => handleDelete(idx)}>
                        Delete
                      </ButtonSound>
                    </>
                  ) : (
                    <>
                      <ButtonSound
                        invisible
                        className={EndgameStyle.EditBtnWrapper}
                        style={{ marginRight: 8 }}
                        onClick={() => {
                          setEditingIndex(idx);
                          setEditedName(player);
                        }}
                      >
                        <img
                          onClick={() => {
                            setEditingEntry(entry);
                            setEditedName(entry.player);
                          }}
                          className={EndgameStyle.EditBtn}
                          src={Edit}
                          alt="Edit icon"
                        />
                      </ButtonSound>
                      {/* textOverflow if name's certain number of characters long */}
                      <span className={`${EndgameStyle.StatsName} ${player.length > 10 ? EndgameStyle.PlayerEllipsis : ""}`}>{player}:&nbsp;</span>
                      <span className={EndgameStyle.StatScores}>{score}</span>
                      <span className={EndgameStyle.StasTime}>{time}</span>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div style={{ padding: 4 }}>
          <label htmlFor="sortByScore" style={{ textShadow: '1px 1px black', fontSize: 18, padding: '2px 6px' }}>
            Sort By Score:
          </label>
          <ButtonSound invisible style={{ padding: 0 }}>
            <select
              id="sortByScore"
              name="sortByScore"
              className={EndgameStyle.SortByScore}
              value={sortScore}
              onChange={(event) => {
                 const value = event.target.value;
                 if (value === "HighScore" || value === "LowScore" || value === "default") {
                   sortByScore(value);
                 } else if (value === "Fastest" || value === "Slowest") {
                   sortByTime(value);
                 }
              }}
            >
              <option value="default"></option>
              <option value="HighScore">High Score</option>
              <option value="LowScore">Low Score</option>
              <option value="Fastest">Fastest Time</option>
              <option value="Slowest">Slowest Time</option>
            </select>
          </ButtonSound>
        </div>
        <div className={EndgameStyle.paginationControls}>
          <ButtonSound
            className={EndgameStyle.prevBtn}
            onClick={() => handlePreviousPage(currentPage)}
            disabled={currentPage === 1}
          >
            Previous
          </ButtonSound>
          <span className={EndgameStyle.pageSpan}>
            Page {currentPage} of {totalPages}
          </span>
          <ButtonSound
            className={EndgameStyle.nextBtn}
            onClick={() => handleNextPage(currentPage)}
            disabled={currentPage === totalPages}
          >
            Next
          </ButtonSound>
        </div>
      </div>

      <div>
        <ButtonSound onClick={() => handleGameSelect('Play Again')} style={{ marginRight: 40 }}>
          Play Again
        </ButtonSound>
        <ButtonSound onClick={() => handleGameSelect('Main Menu')}>Main Menu</ButtonSound>
      </div>
    </>
  );
}
export default Endgame;
