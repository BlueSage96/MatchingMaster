import '../css/Card.css';
/*
   Card flipping logic
*/
function Card({ onClick, color, flipped }) {
  return (
    //set template card here
    <>
      <div className="card-container" onClick={onClick}>
        {/* Flipped used to determine if card has been flipped */}
        <div className={`card-inner ${flipped ? 'flipped' : ''}`}>
          <div className="card-front" style={
            flipped ? color.startsWith("http") ? {
              backgroundImage: `url(${color})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
            : { backgroundColor: color}
            : {}
          }
             ></div>
          <div className="card-back"></div>
        </div>
      </div>
    </>
  );
}
export default Card;
