// Global sound for button and card clicks
import { createContext, useContext, useState } from 'react';
const SoundContext = createContext();

export function SoundProvider({children}) {
    const [buttonSoundEnabled, setButtonSoundEnabled] = useState(true);
    const [cardSoundEnabled, setCardSoundEnabled] = useState(true);
    const [bgSoundEnabled, setBGSoundEnabled] = useState(true);

    //sepate volume states
    const [buttonVolume, setButtonVolume] = useState(25);
    const [cardVolume, setCardVolume] = useState(25);
    const [bgVolume, setBGVolume] = useState(25);

    return (
        <SoundContext.Provider value={{ buttonSoundEnabled, setButtonSoundEnabled, buttonVolume, setButtonVolume,
            cardSoundEnabled, setCardSoundEnabled, cardVolume, setCardVolume,
            bgSoundEnabled, setBGSoundEnabled, bgVolume, setBGVolume}}>
            {children}
        </SoundContext.Provider>
    )
}

export function useSound() {
    return useContext(SoundContext)
}