import Match from '../features/Match';

export default function ToGame({playerName, setPlayerName}) {
    return <Match playerName={playerName} setPlayerName={setPlayerName}/>;
}