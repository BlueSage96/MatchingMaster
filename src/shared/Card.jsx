import '../css/Card.css';
/*
   Card flipping logic
*/
function Card({ onClick, color, flipped }) {
  let displayValue = '';
  
  if (typeof color === 'string') {
    displayValue = color;
  } else if (typeof color === 'object' && color !== null) {
     displayValue = typeof color.image === 'string' ? color.image : '';
  }

  const isImage = typeof displayValue === 'string' && displayValue.startsWith('http');

  return (
    <>
      <div className="card-container" onClick={onClick}>
        <div className={`card-inner ${flipped ? 'flipped' : ''}`}>
          <div className="card-front" style={
            flipped ? isImage ? {
              backgroundImage: `url(${displayValue})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
            : { backgroundColor: displayValue}
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
