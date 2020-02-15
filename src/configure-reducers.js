import {combineReducers} from 'redux';
import {counterReducer} from "./counter/reducer";
import {historicalPriceReducer} from "./equity-price-loader/reducer";
import {connectRouter} from 'connected-react-router';

const createRootReducer = (history) => combineReducers({
    router: connectRouter(history),
    counter: counterReducer,
    historical_price: historicalPriceReducer
});

export default createRootReducer
