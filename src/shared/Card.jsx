import '../css/Card.css';

/*
    Functionality for flipping cards
*/ 
function Card ({onClick, color, flipped}) {
    return (
        <>
            <div className="card-container" onClick={onClick}>
                {/* Card flip state */}
                <div className={`card-inner ${flipped ? 'flipped' : ''}`}>
                    <div className="card-front" style={{ backgroundColor: color }}></div>
                    <div className="card-back"></div>
                </div>
            </div>
        </>
    )
}
export default Card;