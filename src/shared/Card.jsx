import '../css/Card.css';
/*
    Takes three props:

    onClick: Flip handler from Match.
    color: Color to display if flipped/matched.
    flipped: Boolean that controls whether the card shows its front or back.
*/
function Card({ onClick, color, flipped }) {
  return (
    //set template card here
    <>
      <div className="card-container" onClick={onClick}>
        {/* Flipped used to determine if card has been flipped */}
        <div className={`card-inner ${flipped ? 'flipped' : ''}`}>
          <div className="card-front" style={{ backgroundColor: color }}></div>
          <div className="card-back"></div>
        </div>
      </div>
    </>
  );
}
export default Card;
