import moment from 'moment';


const initialState = {};

export const resizeReducer = function (state = initialState, action) {
    switch (action.type) {
        case "UPDATE_WIDTH_AND_HEIGHT":
            return {...state, [action.item]: {width: action.width}};
        default:
            return state;
    }
};
