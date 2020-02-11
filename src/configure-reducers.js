import {combineReducers} from 'redux';
import {counterReducer} from "./counter/reducer";
import {historicalPriceReducer} from "./equity-price-loader/reducer";

export default combineReducers({
    counter: counterReducer,
    historical_price: historicalPriceReducer
});
