const initialState = {
    ric: 'AMD',
    prices: []
};

export const historicalPriceReducer = function (state = initialState, action) {
    switch (action.type) {
        case "UPDATE_RIC":
            return {...state, ric: action.ric};
        case "HISTORICAL_PRICE_LOADED":
            return {...state, prices: action.prices};
        default:
            return state;
    }
};
