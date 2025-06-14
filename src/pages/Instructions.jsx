import { useNavigate } from 'react-router-dom';
import ButtonSound from "../shared/ButtonSound";
function Instructions () {
    const navigate = useNavigate();

    return (
      <>
          <ButtonSound className="backButton" onClick={() => navigate(-1)}>&larr; Back</ButtonSound>
          <h1 style={{position: "absolute", top: "235px"}}>Instructions</h1>
      </>
    )
    
}
export default Instructions;