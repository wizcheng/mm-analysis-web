import React, {Component} from 'react';
import { connect } from 'react-redux';
import request from 'superagent';

class HistoricalPriceLoader extends Component {

    componentDidMount() {
        const {ric, rangeFrom, rangeTo, load, priceType} = this.props;
        load(ric, rangeFrom, rangeTo, priceType);
    }

    render() {
        const {ric, priceType, rangeFrom, rangeTo,
            handleRangeFromChange, handleRangeToChange, handleRicChange, handlePriceTypeChange,
            load, handleKeyPress,
            loadingPrice
        } = this.props;
        return (
            <div>
                <input type='text' value={ric} onChange={handleRicChange} onKeyDown={e => handleKeyPress(e, ric, rangeFrom, rangeTo, priceType)}/>
                <input type='text' value={rangeFrom} onChange={handleRangeFromChange}/>
                <input type='text' value={rangeTo} onChange={handleRangeToChange}/>
                <input type='text' value={priceType} onChange={handlePriceTypeChange}/>
                <button onClick={() => load(ric, rangeFrom, rangeTo, priceType)}>Load</button>
                {loadingPrice ? "Loading" : null}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        ric: state.historical_price.ric,
        rangeFrom: state.historical_price.rangeFrom,
        rangeTo: state.historical_price.rangeTo,
        priceType: state.historical_price.priceType,
        loadingPrice: state.historical_price.loadingPrice
    };
};


const mapDispatchToProps = (dispatch) => {

    const loadRaw = ({ric, rangeFrom, rangeTo, priceType}) => {
        dispatch({
            type: 'LOADING_START'
        });
        request
            .get(`/price/${priceType}/${ric}/${rangeFrom}/${rangeTo}`)
            .end((err, res) => {
                res.body.forEach(it => {
                    if (it.low <= 0) {
                        console.log(it.date + ' have zero value of ' + it.low)
                    }
                });
                dispatch({
                    type: 'LOADING_END'
                });
                dispatch({
                    type: 'HISTORICAL_PRICE_LOADED',
                    prices: res.body.filter(p => p.close > 0)
                })
            });
    };

    return {
        handleKeyPress: (event, ric, rangeFrom, rangeTo, priceType) => {
            if (event.key === 'Enter') {
                loadRaw({ric, rangeFrom, rangeTo, priceType});
            }
        },
        handleRicChange: (event) => dispatch({ type: 'UPDATE_RIC', ric: event.target.value }),
        handleRangeFromChange: (event) => dispatch({ type: 'UPDATE_RANGE_FROM', date: event.target.value }),
        handleRangeToChange: (event) => dispatch({ type: 'UPDATE_RANGE_TO', date: event.target.value }),
        handlePriceTypeChange: (event) => dispatch({ type: 'UPDATE_PRICE_TYPE', priceType: event.target.value }),
        load: (ric, rangeFrom, rangeTo, priceType) => { loadRaw({ric, rangeFrom, rangeTo, priceType}) }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(HistoricalPriceLoader);
