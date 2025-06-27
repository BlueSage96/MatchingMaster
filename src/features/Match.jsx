import { useState, useEffect, useReducer, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import GameBoard from '../features/GameBoard';
import MarvelFetch from '../API/MarvelAPIFetch';
import MatchStyle from '../css/modules/Match.module.css';
import CardClick from '../assets/CardFlip.mp3';
import { useSound } from '../context/SoundContext';
import ButtonSound from '../shared/ButtonSound';

//reducer function used to optimize - file organization & performance

import {
  initialState as matchInitState,
  actions as matchActions,
  matchReducer as matchReducer
} from '../reducers/match.reducer';

//core gameplay logic for card matching
function Match({ playerName, setPlayerName }) {
  const baseColors = ['blue', 'red', 'green', 'purple', 'yellow', 'orange', 'black', 'pink', 'turquoise'];
  const [matchState, dispatch] = useReducer(matchReducer, matchInitState);
  // const [loading, setLoading] = useState(true);
  // const [gameDeck, setGameDeck] = useState([]);
  // const [matchedCards, setMatchedCards] = useState([]);
  // const [flippedCards, setFlippedCards] = useState([]);
  // const [lockedBoard, setLockedBoard] = useState(false);
  // const [isGameOver, setIsGameOver] = useState(false);
  // const [playerStats, setPlayerStats] = useState(null);
  // const [attempts, setAttempts] = useState(0);
  // const [apiError, setApiError] = useState('');

  const [nameSubmitted, setNameSubmitted] = useState(false);
  const { cardSoundEnabled } = useSound();
  const CardClickRef = useRef(new Audio(CardClick));
  const location = useLocation();
  const navigate = useNavigate();

  const modeFromState = location.state?.mode;
  const modeFromStorage = localStorage.getItem('lastMode');
  const gameMode = modeFromState || modeFromStorage || 'color';
 

  useEffect(() => {
    setPlayerName('');
    if (modeFromState) {
      localStorage.setItem('lastMode', modeFromState);
    }
    return () => {};
  }, [setPlayerName, modeFromState]);

  // enhanced shuffling algorithm
  function fisherYatesShuffle(array) {
    const shuffled = array.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /* Fetch images from Marvel API - fall back to color if it can't fetch */
  async function loadCharacters() {
    try {
      dispatch({type: matchActions.setIsLoading, value: true});
      const images = await MarvelFetch();
      if (!images || images.length < 9) {
        throw new Error('Not enough character images returned');
      }
      const duplicates = [...images, ...images];
      const shuffled = fisherYatesShuffle(duplicates);
      dispatch({type: matchActions.setGameDeck, value: shuffled});
    } 
    
    catch (error) {
      const doubleColors = [...baseColors, ...baseColors];
      const shuffled = fisherYatesShuffle(doubleColors);
      dispatch({type: matchActions.setGameDeck, value: shuffled});

      console.error('Error loading characters. : ', error);
      dispatch({type: matchActions.setApiError, value:'Falling back to color mode due to API error'});
    } 
    
    finally {
      dispatch({type: matchActions.setIsLoading, value: false});
    }
  }

  // Shuffling according to game mode
  useEffect(() => {
    async function setupDeck() {
      dispatch({type: matchActions.setLoading, value:true});
      dispatch({type: matchActions.setMatchedCards, value:[]});
      dispatch({type: matchActions.setFlippedCards, value:[]});

      if (gameMode === 'marvel') {
        await loadCharacters();
      } else {
        const duplicated = [...baseColors, ...baseColors];
        dispatch({type: matchActions.setGameDeck, value: fisherYatesShuffle(duplicated)});
        dispatch({type: matchActions.setIsLoading, value: false});
      }
    }
    setupDeck();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameMode]);

  useEffect(() => {
    const audio = new Audio(CardClick);
    audio.preload = 'auto';
    CardClickRef.current.load();

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  const handleFlippedCards = useCallback(
    (index) => {
      if (matchState.lockedBoard || matchState.flippedCards.includes(index) || matchState.matchedCards.includes(index)) return;

      if (cardSoundEnabled && CardClickRef.current) {
        CardClickRef.currentTime = 0;
        CardClickRef.current.play();
      }

      const newFlipped = [...matchState.flippedCards, index];
      dispatch({type: matchActions.setFlippedCards, value: newFlipped});

      if (newFlipped.length === 2) {
        dispatch({type: matchActions.setLockedBoard, value: true});
        dispatch({type: matchActions.setAttempts, value: matchState.attempts + 1});
        
        const [firstIndex, secondIndex] = newFlipped;

        if (matchState.gameDeck[firstIndex] === matchState.gameDeck[secondIndex]) {
          dispatch({type: matchActions.setMatchedCards, 
            value: [...matchState.matchedCards, firstIndex, secondIndex]});
        }
        setTimeout(() => {
          dispatch({type: matchActions.setFlippedCards, value: []});
          dispatch({type: matchActions.setLockedBoard, value: false});
        }, 1000);
      }
    },
    [matchState.flippedCards, matchState.lockedBoard, matchState.gameDeck, matchState.matchedCards, matchState.attempts, cardSoundEnabled]
  );

  // No cleanup needed — no subscriptions or intervals set
  useEffect(() => {
    let cancelled = false;
    if (matchState.matchedCards.length === matchState.gameDeck.length && 
      matchState.gameDeck.length > 0 && !matchState.isGameOver && !cancelled) {
      const numPairs = matchState.gameDeck.length / 2;
      const baseScore = numPairs * 100;
      const penalty = Math.max(0, (matchState.attempts - numPairs) * 10);
      const stats = {
        player: playerName,
        score: Math.max(0, baseScore - penalty),
        attempts: matchState.attempts,
      };
      dispatch({type: matchActions.setPlayerStats, value: stats});

      setTimeout(() => {
        dispatch({type: matchActions.setIsGameOver, value: true});
      }, 1000);
      return () => {
        cancelled = true;
      };
    }
  }, [matchState.matchedCards, matchState.gameDeck, matchState.isGameOver, playerName, matchState.attempts]);

  if (matchState.loading) {
    return (
      <>
        <div className={MatchStyle.LoadingContainer}>
          <div className={MatchStyle.Loading}>
            <p>Loading game cards...</p>
          </div>
          <div className={MatchStyle.FetchingMode}>
            <p>{gameMode === 'marvel' ? 'Fetching Marvel characters...' : 'Preparing color cards...'}</p>
          </div>
        </div>
      </>
    );
  }

  if (matchState.isGameOver && !nameSubmitted) {
    return (
      <form
        className={MatchStyle.PlayerForm}
        onSubmit={(event) => {
          event.preventDefault();
          const fullStats = { ...matchState.playerStats, player: playerName };
          const storedData = JSON.parse(localStorage.getItem('matchStats')) || [];
          const updatedStats = [...storedData, fullStats];
          localStorage.setItem('matchStats', JSON.stringify(updatedStats));
          setNameSubmitted(true);
          navigate('/gameOver', { state: { ...fullStats, mode: gameMode } });
        }}
      >
        <label className={MatchStyle.playerLabel} htmlFor="playerName">
          Enter your name to see your score:{' '}
        </label>
        <input
          className={MatchStyle.StylePlayerInput}
          type="text"
          id="playerName"
          value={playerName}
          onChange={(event) => setPlayerName(event.target.value)}
          required
        />

        <ButtonSound style={{ padding: '12px 16px', fontSize: '22px' }} type="submit">
          Submit
        </ButtonSound>
      </form>
    );
  }

  if (matchState.isGameOver && nameSubmitted) {
    return null;
  }

  return (
    <>
      <ButtonSound className={MatchStyle.GameBackBtn} onClick={() => navigate(-1)}>
        &larr; Back
      </ButtonSound>
      {matchState.apiError && <p style={{ color: 'red' }}>{matchState.apiError}</p>}
      <GameBoard
        gameDeck={matchState.gameDeck}
        flippedCards={matchState.flippedCards}
        matchedCards={matchState.matchedCards}
        handleFlippedCards={handleFlippedCards}
      />
    </>
  );
}
export default Match;
