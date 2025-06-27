const actions = {
    setFlippedCards: 'setFlippedCards',
    setMatchedCards: 'setMatchedCards',
    setLockedBoard: 'setLockedBoard',
    setAttempts: 'setAttempts',
    setIsGameOver: 'setIsGameOver',
    setPlayerStats: 'setPlayerStats',
    setGameDeck: 'setGameDeck',
    setIsLoading: 'setIsLoading',
    setApiError: 'setApiError'
};

const initialState = {
    flippedCards: [],
    matchedCards: [],
    gameDeck: [],
    lockedBoard: false,
    isGameOver: false,
    isLoading: false,
    attempts: 0,
    playerStats: {},
    apiError: ''
};

function matchReducer (state = initialState, action) {
    switch (action.type) {
        case actions.setFlippedCards:
            return {
                ...state,
                flippedCards: action.value
            }
        case actions.setMatchedCards:
            return {
                ...state,
                matchedCards: action.value
            }
        case actions.setGameDeck: 
            return {
                ...state,
                gameDeck: action.value
        }  
        case actions.setLockedBoard:
            return {
                ...state,
                lockedBoard: action.value
            }
        case actions.setIsGameOver:
            return {
                ...state,
                isGameOver: action.value
        } 
        case actions.setIsLoading:
            return {
                ...state,
                isLoading: action.value
        }
        case actions.setAttempts: 
            return {
                ...state,
                attempts: action.value
            }
        case actions.setPlayerStats:
            return {
                ...state,
                playerStats: action.value
            }
        case actions.setApiError:
            return {
                ...state,
                apiError: action.value
            }
        default:
            return state;
    }
}

export { actions, initialState, matchReducer };