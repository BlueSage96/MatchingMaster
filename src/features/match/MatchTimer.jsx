import { useState, useEffect } from 'react';
import TimerStyle from 'styled-components';
function MatchTimer({gameTimer, setGameTimer}) {
    const Timer = TimerStyle.span`
        color: white;
        position: absolute;
        bottom: 200px;
        left: width/2;
        font-size: 30px;
    `

    const [timeElapsed, setTimeElapsed] = useState(0);

    useEffect(() => {
        if (!gameTimer) return;
        const interval = setInterval(() => {
            setTimeElapsed(Math.floor((Date.now() - gameTimer)/ 1000));
        },1000);
        return () => clearInterval(interval);
    },[gameTimer]);

    const minutes = Math.floor(timeElapsed / 60);
    const seconds = timeElapsed % 60;
    //shows missing 0 - i.e. 0.09 or 1:01
    const paddedSeconds = String(seconds).padStart(2,'0');

    console.log("Time", setGameTimer);

    return (
        <>
            {gameTimer && (
                <Timer>
                    Time {minutes}:{paddedSeconds}
                </Timer>
            )}
        </>
    )
}
export default MatchTimer;