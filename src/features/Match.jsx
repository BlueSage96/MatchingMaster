import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Card from '../shared/Card';
import MarvelFetch from '../API/MarvelAPIFetch';
import MatchStyle from '../css/modules/Match.module.css';
import CardClick from '../assets/CardFlip.mp3';
import { useSound } from '../context/SoundProvider';
import ButtonSound from '../shared/ButtonSound';


function Match({playerName, setPlayerName}) {
  const baseColors = ['blue','red','green','purple','yellow','orange','black','pink','turquoise'];
  const [loading, setLoading] = useState(true);
  const [gameDeck, setGameDeck] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [lockedBoard, setLockedBoard] = useState(false); 
  const [isGameOver, setIsGameOver] = useState(false);
  const [playerStats, setPlayerStats] = useState(null);
  const [nameSubmitted, setNameSubmitted] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const location = useLocation();
  const navigate = useNavigate();
  const gameMode = location.state?.mode;

  const { cardSoundEnabled } = useSound();
  const CardClickRef = useRef(new Audio(CardClick));

  // enhanced shuffling algorithm
  function fisherYatesShuffle (array) {
    const shuffled = array.slice();
    for (let i = shuffled.length - 1; i > 0; i--){
      const j = Math.floor((crypto.getRandomValues(new Uint32Array(1))[0]/2**32*(i+1)));
      [shuffled[i],shuffled[j]] = [shuffled[j],shuffled[i]];
    }
    return shuffled;
  }

  /* Fetch images from Marvel API - fall back to color if it can't fetch */
  async function loadCharacters() {
     try {
       setLoading(true);
       console.log("Fetching Marvel characters");
       const images = await MarvelFetch();
       console.log("Marvel API response:", images);

       if (!images || images.length < 9) {
          throw new Error("Not enough character images returned");
       }

       const duplicates = [...images,...images];
       const shuffled = fisherYatesShuffle(duplicates);
       setGameDeck(shuffled);
     } catch (error) {
        console.log("Error loading characters: ", error);
        console.log("Falling back to color mode due to API error");
        const doubleColors = [...baseColors, ...baseColors];
        const shuffled = fisherYatesShuffle(doubleColors);
        setGameDeck(shuffled);
     } finally {
        setLoading(false);
     }
  }

  // Shuffling according to game mode
  useEffect(() => {
    async function setupDeck() {
      setLoading(true);
      setMatchedCards([]);
      setFlippedCards([]);

      if (gameMode === 'marvel') {
        await loadCharacters();
        console.log('Setting up character mode');
      } else {
        const duplicated = [...baseColors, ...baseColors];
        setGameDeck(fisherYatesShuffle(duplicated));
        setLoading(false);
      }
    }
    setupDeck();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[gameMode]);

  useEffect(() => {
     const audio = new Audio(CardClick);
     audio.preload = 'auto';
     CardClickRef.current.load();
  },[]);

  /*
     Matching algorithm
    */
  const handleFlippedCards = useCallback((index) => {
    if (lockedBoard || flippedCards.includes(index) || matchedCards.includes(index)) return;
   
    if (cardSoundEnabled && CardClickRef.current) {
       CardClickRef.currentTime = 0;
       CardClickRef.current.play();
    }

    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setLockedBoard(true); //lock board for a sec when there's a match
      setAttempts((prev) => prev + 1);
      const [firstIndex, secondIndex] = newFlipped;

      if (gameDeck[firstIndex] === gameDeck[secondIndex]) {
        setMatchedCards(prev => [...prev, firstIndex, secondIndex]);
      
      } 
      setTimeout(() => {
          setFlippedCards([]);
          setLockedBoard(false);
      }, 1000);
    }
  },[flippedCards, lockedBoard, gameDeck, matchedCards, cardSoundEnabled]);


  useEffect(() => {
  if (matchedCards.length === gameDeck.length && gameDeck.length > 0 && !isGameOver) {
       const numPairs = gameDeck.length / 2;
       const baseScore = numPairs * 100;
       const penalty = Math.max(0, (attempts - numPairs) * 10 )
       const stats = {
          player: playerName,
          score: Math.max(0, baseScore - penalty),
          attempts,
       };
       setPlayerStats(stats);      

         setTimeout(() => {
            setIsGameOver(true);
        },1000);
      
    }
  },[matchedCards, gameDeck, isGameOver, playerName, attempts]);

  if (loading) {
     return (
        <>
          <div className={MatchStyle.LoadingContainer}>
              <div className={MatchStyle.Loading}><h2>Loading game cards...</h2></div>
              <div className={MatchStyle.FetchingMode}>
                <h3>{gameMode === "marvel" ? "Fetching Marvel characters..." : "Preparing color cards..."}</h3>
              </div>
          </div>
        </>
     )
  }

    if (isGameOver && !nameSubmitted) {
      return (
         <form
          className={MatchStyle.PlayerForm}
          onSubmit={(event) => {
              event.preventDefault();
              const fullStats = { ...playerStats, player: playerName };
              const storedData = JSON.parse(localStorage.getItem('matchStats')) || [];
              storedData.push(fullStats);
              localStorage.setItem('matchStats', JSON.stringify(storedData));
              setNameSubmitted(true);
              navigate("/gameOver", {state: fullStats});
          }}
          >
            <label className={MatchStyle.playerLabel} htmlFor="playerName">Enter your name to see your score: </label>
            <input 
              className={MatchStyle.StylePlayerInput}
              type="text"
              value={playerName}
              onChange={(event) => setPlayerName(event.target.value)}
              required />

            <ButtonSound style={{padding: "12px 16px"}} type="submit">Submit</ButtonSound>
          </form>
      )
  }

  return (
    <>
     <ButtonSound className={MatchStyle.GameBackBtn} onClick={() => navigate(-1)}>&larr; Back</ButtonSound>
        <div className={MatchStyle.MatchHeader}>
      <div className={MatchStyle.Game}>
            {gameDeck.map((item, index) => (
        <Card
          key={index}
          color={item} 
          flipped={flippedCards.includes(index) || matchedCards.includes(index)} 
          onClick={() => handleFlippedCards(index)}
        />
      ))}
      </div>
    </div>

    </>
  );
}
export default Match;