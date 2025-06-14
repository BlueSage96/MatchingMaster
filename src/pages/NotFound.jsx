import NFStyle from "styled-components";
function NotFound () {
    const Title = NFStyle.h1 `
        position: absolute; 
        top: 400px;
        text-align: center;
        animation: blink 3s infinite;

        &:hover {
            color: red;
        }
        
        @keyframes blink {
            0% {
                opacity: 1;
            }
            50% {
                opacity: 0;
            }
            100 {
                opacity: 1;
            } 
        };
    `

    return (
        <Title> Sorry you're on the wrong page!</Title>
    )
}
export default NotFound;