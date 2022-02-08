import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import gameReducer from './Reducers';

const rootReducer = combineReducers({gameReducer});

export const store = createStore(rootReducer, applyMiddleware(thunk));