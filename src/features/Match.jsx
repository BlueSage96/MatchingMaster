import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Card from '../shared/Card';
import MarvelFetch from '../API/MarvelAPIFetch';
import MatchStyle from '../css/modules/Match.module.css';
import CardClick from '../assets/CardFlip.mp3';
import { useSound } from '../context/SoundProvider';
import ButtonSound from '../shared/ButtonSound';

function Match() {
  const baseColors = ['blue', 'red', 'green', 'purple', 'yellow', 'orange','black','pink','turquoise'];
  const [loading, setLoading] = useState(true);
  const [gameDeck, setGameDeck] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [lockedBoard, setLockedBoard] = useState(false); //briefly lock board after a match is made
  const [isGameOver, setIsGameOver] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const gameMode = location.state?.mode;

  const { cardSoundEnabled } = useSound();
  const CardClickRef = useRef(new Audio(CardClick));

  // enhanced shuffling algorithm
  function FisherYatesShuffle (array) {
    const shuffled = array.slice();
    for (let i = shuffled.length - 1; i > 0; i--){
      const j = Math.floor((crypto.getRandomValues(new Uint32Array(1))[0]/2**32*(i+1)));
      [shuffled[i],shuffled[j]] = [shuffled[j],shuffled[i]];
    }
    return shuffled;
  }

  /* Fetch images from Marvel API - fall back to color if it can't fetch */
  async function LoadCharacters() {
     try {
       setLoading(true);
       console.log("Fetching Marvel characters");
       const images = await MarvelFetch();
       console.log("Marvel API response:", images);

       if (!images || images.length < 9) {
          throw new Error("Not enough character images returned");
       }

       const duplicates = [...images,...images];
       const shuffled = FisherYatesShuffle(duplicates);
       setGameDeck(shuffled);
     } catch (error) {
        console.log("Error loading characters: ", error);
        console.log("Falling back to color mode due to API error");
        const doubleColors = [...baseColors, ...baseColors];
        const shuffled = FisherYatesShuffle(doubleColors);
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
        await LoadCharacters();
        console.log("Setting up character mode");
      }
      else {
        const duplicated = [...baseColors, ...baseColors];
        setGameDeck(FisherYatesShuffle(duplicated));
        setLoading(false);
      }
    }
    setupDeck();
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

  return (
    <>
      <Link to="/">
          <ButtonSound className={MatchStyle.GameBackBtn}>&larr; Back</ButtonSound>
      </Link>
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