import { useState, useEffect, useRef, useCallback, useReducer } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MarvelFetch from '../../API/MarvelAPIFetch';
import PokéFetch from "../../API/PokémonAPIFetch";
import AnimalsFetch from '../../API/AnimalsAPIFetch';
import CardClick from '../../assets/CardFlip.mp3';
import { useSound } from '../../context/SoundContext';

//reducer function used to optimize - file organization & peformance
import {
    initialState as matchInitState,
    actions as matchActions,
    matchReducer as matchReducer
} from '../../reducers/match.reducer';

function MatchLogic (playerName, setPlayerName, gameTimer) {
    const baseColors = ['blue', 'red', 'green', 'purple', 'yellow', 'orange', 'black', 'pink', 'turquoise'];
    const [matchState, dispatch] = useReducer(matchReducer, matchInitState);
    const { cardSoundEnabled } = useSound();
    const CardClickRef = useRef(new Audio(CardClick));
    const [nameSubmitted, setNameSubmitted] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const modeFromState = location.state?.mode;
    const modeFromStorage = localStorage.getItem('lastMode');
    const marvelMode = location.state?.marvelMode || 'characters';
    const animalMode = location.state?.animalMode || 'animals';

    let gameMode = modeFromState || modeFromStorage || 'color';

    if (location.state?.animalMode && gameMode !== 'animals') {
      gameMode = 'animals';
    }
    if (location.state?.marvelMode && gameMode !== 'marvel') {
      gameMode = 'marvel';
    }
    
    const totalTime = Math.floor((Date.now() - gameTimer) / 1000);
    const minutes = Math.floor(totalTime / 60);
    const seconds = totalTime % 60;
    const paddedSeconds = String(seconds).padStart(2,'0');

    useEffect(() => {
      setPlayerName('');
      if (modeFromState) {
        localStorage.setItem('lastMode', modeFromState);
      }
      return () => {};
    }, [setPlayerName, modeFromState]);

    // enhanced shuffling algorithm
    function fisherYatesShuffle(array, numCols = 9) {
      const arr = array.slice();
      const result = [];
      while (arr.length) {
        // Try up to 10 times to pick a non-adjacent value
        let idx = Math.floor(Math.random() * arr.length);
        let tries = 0;
        while (tries < 10) {
          const candidate = arr[idx];
          const pos = result.length;
          const left = pos % numCols !== 0 && result[pos - 1] === candidate;
          const up = pos >= numCols && result[pos - numCols] === candidate;
          if (!left && !up) break;
          idx = Math.floor(Math.random() * arr.length);
          tries++;
        }
        result.push(arr.splice(idx, 1)[0]);
      }
      return result;
    }

    // centralizes duplication
    const prepGameDeck = (duplicates) => {
       const duplicated = [...duplicates, ...duplicates];
       return fisherYatesShuffle(duplicated);
    }    

    const fallbackToColors = (baseColors, shuffle) => {
      return prepGameDeck(baseColors, shuffle);
    }

    /* Fetch images from APIs - fall back to color if it can't fetch */
    async function loadGameData (mode, marvelMode, animalMode) {
      try {
        dispatch({ type: matchActions.setIsLoading, value: true });
        let images;
        if (mode === 'marvel') {
          images = await MarvelFetch(marvelMode);
        } else if (mode === 'pokémon') {
          images = await PokéFetch();
        } else if (mode === 'animals') {
          images = await AnimalsFetch(animalMode);
        } else if (mode === 'color') {
           const deck = fallbackToColors(baseColors, fisherYatesShuffle);
           dispatch({ type: matchActions.setGameDeck, value: deck });
           return;
        } else {
           //unknown mode fallback to colors
           const deck = fallbackToColors(baseColors, fisherYatesShuffle);
           dispatch({ type: matchActions.setGameDeck, value: deck });
           return;
        }
        if (!images || images.length < 9) {
          throw new Error('Not enough images returned');
        }
        const deck = prepGameDeck(images);
        dispatch({ type: matchActions.setGameDeck, value: deck });
      } catch (error) {
        const deck = fallbackToColors(baseColors, fisherYatesShuffle);
        dispatch({ type: matchActions.setGameDeck, value: deck });
        dispatch({ type: matchActions.setApiError, value: 'Falling back to color mode due to API error' });
        console.error('Error loading data:', error);
      } finally {
        dispatch({ type: matchActions.setIsLoading, value: false });
      }
    }

    // Shuffling according to game mode
    useEffect(() => {
      async function setupDeck() {
        dispatch({ type: matchActions.setIsLoading, value: true });
        dispatch({ type: matchActions.setMatchedCards, value: [] });
        dispatch({ type: matchActions.setFlippedCards, value: [] });

        await loadGameData(gameMode, marvelMode, animalMode);
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

    const handleFlippedCards = useCallback((index) => {
        if (matchState.lockedBoard || matchState.flippedCards.includes(index) || matchState.matchedCards.includes(index)) return;

        if (cardSoundEnabled && CardClickRef.current) {
          CardClickRef.currentTime = 0;
          CardClickRef.current.play();
        }

        const newFlipped = [...matchState.flippedCards, index];
        dispatch({ type: matchActions.setFlippedCards, value: newFlipped });

        if (newFlipped.length === 2) {
          dispatch({ type: matchActions.setLockedBoard, value: true });
          dispatch({ type: matchActions.setAttempts, value: matchState.attempts + 1 });
          const [firstIndex, secondIndex] = newFlipped;

          if (matchState.gameDeck[firstIndex] === matchState.gameDeck[secondIndex]) {
            dispatch({
              type: matchActions.setMatchedCards,
              value: [...matchState.matchedCards, firstIndex, secondIndex]
            });
          }
          setTimeout(() => {
            dispatch({ type: matchActions.setFlippedCards, value: [] });
            dispatch({ type: matchActions.setLockedBoard, value: false });
          }, 1000);
        }
      },

      [matchState.flippedCards, matchState.lockedBoard, matchState.gameDeck, matchState.matchedCards, matchState.attempts, cardSoundEnabled]);

    // No cleanup needed — no subscriptions or intervals set
    useEffect(() => {
      let cancelled = false;
      if (matchState.matchedCards.length === matchState.gameDeck.length &&
        matchState.gameDeck.length > 0 && !matchState.isGameOver && !cancelled) {
        const numPairs = matchState.gameDeck.length / 2;
        const baseScore = numPairs * 100;
        //more dynamic penalty system
        const penalty = Math.min(baseScore, Math.pow(Math.max(0, matchState.attempts - numPairs), 1.5) * 10);

        let bonus = 0;
        if (matchState.attempts === numPairs) {
          bonus = 50;
        } else if (matchState.attempts === numPairs + 1) {
          bonus = 25;
        }

        let timeBonus = 0;
        if (totalTime < 30) {
          timeBonus = 50;
        } else if (totalTime < 60) {
          timeBonus = 25;
        } else if (totalTime >= 60) {
           timeBonus -= 25;
        }

        console.log("TimeBonus:",timeBonus);

        const salt = Math.floor(Math.random() * 10);
        const stats = {
          player: playerName,
          score: Math.max(0, Math.round(baseScore - penalty + bonus + salt + timeBonus)),
          attempts: matchState.attempts,
          time: `${minutes}:${paddedSeconds}`
        };
        dispatch({ type: matchActions.setPlayerStats, value: stats });

        setTimeout(() => {
          dispatch({ type: matchActions.setIsGameOver, value: true });
        }, 1000);
        return () => {
          cancelled = true;
        };
      }
    }, [matchState.matchedCards, matchState.gameDeck, matchState.isGameOver, matchState.attempts, 
      playerName, minutes, paddedSeconds, totalTime]);

   return {
      matchState,
      matchActions,
      handleFlippedCards,
      dispatch,
      nameSubmitted,
      setNameSubmitted,
      gameMode,
      marvelMode,
      animalMode,
      navigate,
      fisherYatesShuffle,
      loadGameData
   }
    
}
export default MatchLogic;