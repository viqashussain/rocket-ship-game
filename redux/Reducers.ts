import { DECREASE_HEALTH, INCREASE_HEALTH, INCREMENT_LEVEL, UPDATE_SCORE, RESET_GAME } from "./Actions";

const initialState = {
    score: 0,
    level: 1,
    health: 100
};

function gameReducer(state = initialState, action: any) {
    switch (action.type) {
        case UPDATE_SCORE:
            return { ...state, score: action.payload };
        case INCREASE_HEALTH:
            if (state.health < 100)
            {
                return { ...state, health: state.health + 25 };
            }
            return state;
        case DECREASE_HEALTH:
            return { ...state, health: state.health - 25 };
        case INCREMENT_LEVEL:
            return { ...state, level: state.level + 1 };
        case RESET_GAME:
            return { ...state, level: 1, health: 100, score: 0 };

        default:
            return state;
    }
}

export default gameReducer;