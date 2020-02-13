import moment from 'moment';


const initialState = {
    // ric: '1858.HK',
    // ric: '2318.HK',
    // rangeFrom: moment().subtract(6, 'months').format('YYYY-MM-DD'),
    // rangeTo: moment().format('YYYY-MM-DD'),
    ric: 'BITA',
    rangeFrom: '2013-07-01',
    rangeTo: '2013-12-01',
    priceType: 'daily',
    prices: []
};

export const historicalPriceReducer = function (state = initialState, action) {
    switch (action.type) {
        case "UPDATE_RIC":
            return {...state, ric: action.ric};
        case "UPDATE_RANGE_FROM":
            return {...state, rangeFrom: action.date};
        case "UPDATE_RANGE_TO":
            return {...state, rangeTo: action.date};
        case "UPDATE_PRICE_TYPE":
            return {...state, priceType: action.priceType};
        case "HISTORICAL_PRICE_LOADED":
            return {...state, prices: action.prices};
        default:
            return state;
    }
};
