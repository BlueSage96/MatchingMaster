import { useState, useEffect } from 'react';
import Card from '../shared/Card.jsx';
function Match() {
  const baseColors = ['blue', 'red', 'green', 'purple', 'yellow', 'orange'];
  const [cards, setCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [lockedBoard, setLockedBoard] = useState(false); //briefly lock board after a match is made

  /*use effect to duplicate base colors, shuffle cards on mount, & sets up the board 
    use Math.random & sort (also filter when using Marvel API)
    line 18: event listener
    lines 19 & 20: cleanup function (including setCards) - don't change 0.5
    line 21: dependency array *Don't add baseColors will cause error & color flickering
    */
  useEffect(() => {
    const shuffleCards = [...baseColors, ...baseColors].sort(
      () => 0.5 - Math.random()
    );
    setCards(shuffleCards);
  }, []);

  /*
     handleCardFlip(index)

    Prevents flipping if:

    The board is locked.
    The card is already flipped or matched

    Lines 52 & 53: Adds the clicked card index to setFlippedCards. 
    Hint: need a variable that accepts flippedCards & the card index

    If 2 cards are flipped:

    Temporarily locks the board.
    If they match: adds them to matchedCards.
    In both cases, resets flippedCards after 1 second.
    */
  function handleFlippedCards(index) {
    //initializing
    if (lockedBoard) return; //determine if board needs to be locked
    if (flippedCards.includes(index) || matchedCards.includes(index)) return;

    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setLockedBoard(true); //lock board for a sec when there's a match

      //new variables for indicies that are compared to one another
      const [firstIndex, secondIndex] = newFlipped;

      //compare the two cards for a match
      if (cards[firstIndex] === cards[secondIndex]) {
        //Match found
        setMatchedCards([...matchedCards, firstIndex, secondIndex]);
        //lock the board for a second
        setTimeout(() => {
          setFlippedCards([]);
          setLockedBoard(false);
        }, 1000);
      } else {
        //not matched
        setTimeout(() => {
          setFlippedCards([]);
          setLockedBoard(false);
        }, 1000);
      }
    }
  }

  /*
       Rendered Output:

       A flexbox layout with cards.

       Each card:

       Gets its color.
       Checks if it's currently flipped or matched.
       Triggers handleCardFlip() when clicked.
    
    */
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', padding: '10px' }}>
      {cards.map((color, index) => (
        <Card
          key={index}
          color={cards[index]} // always pass color
          flipped={flippedCards.includes(index) || matchedCards.includes(index)} // controls rotation
          onClick={() => handleFlippedCards(index)}
        />
      ))}
    </div>
  );
}
export default Match;
