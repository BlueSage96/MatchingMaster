import Card from '../shared/Card';
import GBStyle from '../css/modules/GameBoard.module.css';
function GameBoard({
  gameDeck,
  flippedCards,
  matchedCards,
  handleFlippedCards,
}) {
  return (
    <>
      <div className={GBStyle.MatchHeader}>
        <div className={GBStyle.Game}>
          {gameDeck.map((item, index) => (
            <Card
              key={item.id || `${item.name}-${index}`}
              color={item}
              flipped={
                flippedCards.includes(index) || matchedCards.includes(index)
              }
              onClick={() => handleFlippedCards(index)}
            />
          ))}
        </div>
      </div>
    </>
  );
}
export default GameBoard;
