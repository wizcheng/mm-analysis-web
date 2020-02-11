import React from 'react';
import { connect } from 'react-redux';
import request from 'superagent';

const HistoricalPriceLoader = ({ ric, handleRicChange, load, handleKeyPress }) => (
    <div>
        <input type='text' value={ric} onChange={handleRicChange} onKeyDown={ e => handleKeyPress(e, ric)}/>
        <button onClick={() => load(ric)}>Load</button>
    </div>
);

const mapStateToProps = state => {
    return {
        ric: state.historical_price.ric
    };
};


const mapDispatchToProps = (dispatch) => {

    const loadRaw = (ric) => {
        request
            .get(`/price/historical/${ric}`)
            .end((err, res) => {
                dispatch({
                    type: 'HISTORICAL_PRICE_LOADED',
                    prices: res.body
                })
            });
    };

    return {
        handleKeyPress: (event, ric) => {
            if (event.key === 'Enter') {
                loadRaw(ric);
            }
        },
        handleRicChange: (event) => dispatch({ type: 'UPDATE_RIC', ric: event.target.value }),
        load: (ric) => { loadRaw(ric) }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(HistoricalPriceLoader);
