import moment from 'moment';


const initialState = {
    // ric: '1858.HK',
    // ric: '2318.HK',
    ric: 'AMD',
    // rangeFrom: moment().subtract(6, 'months').format('YYYY-MM-DD'),
    // rangeTo: moment().format('YYYY-MM-DD'),
    // ric: 'BITA',
    rangeFrom: '2019-08-01',
    rangeTo: '2020-12-01',
    priceType: 'daily',
    // priceType: 'weekly',
    prices: [],
    loadingPrice: false
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
        case "LOADING_START":
            return {...state, loadingPrice: true};
        case "LOADING_END":
            return {...state, loadingPrice: false};
        default:
            return state;
    }
};
