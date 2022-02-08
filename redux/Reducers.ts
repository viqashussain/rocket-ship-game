import { DECREASE_HEALTH, INCREASE_HEALTH, INCREMENT_LEVEL, UPDATE_SCORE } from "./Actions";

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
            return { ...state, health: state.health + 25 };
        case DECREASE_HEALTH:
            return { ...state, health: state.health - 25 };
        case INCREMENT_LEVEL:
            return { ...state, level: state.level + 1 };

        default:
            return state;
    }
}

export default gameReducer;