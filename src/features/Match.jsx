import { useEffect } from 'react';
import GameBoard from './GameBoard';
import MatchStyle from '../css/modules/Match.module.css';
import ButtonSound from '../context/ButtonSound';
import MatchLogic from '../features/match/MatchLogic';
import MatchTimer from '../features/match/MatchTimer';

//Core gameplay logic for card matching
function Match({ playerName, setPlayerName, gameTimer, setGameTimer }) {
  const baseColors = ['blue', 'red', 'green', 'purple', 'yellow', 'orange', 'black', 'pink', 'turquoise'];

  const {
    handleFlippedCards, matchState,matchActions,dispatch,nameSubmitted, setNameSubmitted,
    gameMode, marvelMode, animalMode, navigate, fisherYatesShuffle, loadGameData } = 
    MatchLogic(playerName, setPlayerName, gameTimer);

  //reset when leaving page
  useEffect(() => {
    setGameTimer(Date.now());
    return () => {
      setGameTimer(null);
    }
  }, [setGameTimer]);

  const handleGameReset = () => {
    dispatch({ type: matchActions.setFlippedCards, value: [] });
    dispatch({ type: matchActions.setMatchedCards, value: [] });
    dispatch({ type: matchActions.setIsGameOver, value: false });
    dispatch({ type: matchActions.setPlayerStats, value: {} });
    dispatch({ type: matchActions.setAttempts, value: 0 });
    
     setGameTimer(Date.now());

    if (gameMode === 'color') {
       dispatch({ type: matchActions.setGameDeck, value: fisherYatesShuffle([...baseColors, ...baseColors] )});
    } else {
      loadGameData(gameMode, marvelMode, animalMode);
    }

  };

  if (matchState.isLoading) {
    return (
      <>
        <div className={MatchStyle.LoadingContainer}>
          <div className={MatchStyle.Loading}>
            <p>Loading game cards...</p>
          </div>
          <div className={MatchStyle.FetchingMode}>
            <p>{gameMode === 'marvel' ? `Fetching Marvel ${marvelMode}...` : gameMode === 'pokémon' ? 'Fetching Pokémon characters...' : 
            gameMode === 'animals' ? `Fetching ${animalMode} cards...` : 'Preparing color cards...'}</p>
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

      <ButtonSound className={MatchStyle.Reset} onClick={() => handleGameReset()}>
        Reset
      </ButtonSound>

      <MatchTimer gameTimer={gameTimer} setGameTimer={setGameTimer} />

      {matchState.apiError && (
        <p className={MatchStyle.Error}>{matchState.apiError}</p>
      )}
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