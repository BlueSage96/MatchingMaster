// Global sound for button and card clicks
import { createContext, useContext, useState } from 'react';
const SoundContext = createContext();

export function SoundProvider({children}) {
    const [buttonSoundEnabled, setButtonSoundEnabled] = useState(true);
    const [cardSoundEnabled, setCardSoundEnabled] = useState(true);

    return (
        <SoundContext.Provider value={{ buttonSoundEnabled, setButtonSoundEnabled,
            cardSoundEnabled, setCardSoundEnabled,
        }}>
            {children}
        </SoundContext.Provider>
    )
}

export function useSound() {
    return useContext(SoundContext)
}