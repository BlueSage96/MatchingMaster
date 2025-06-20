import GameOver from '../features/Endgame';

export default function ToGameOver({playerName, setPlayerName}) {
    return <GameOver playerName={playerName} setPlayerName={setPlayerName}/>;
}