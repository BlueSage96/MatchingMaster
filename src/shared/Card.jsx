import '../css/Card.css';
/*
   Card flipping logic
*/
function Card({ onClick, color, flipped }) {
  return (
    <>
      <div className="card-container" onClick={onClick}>
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
