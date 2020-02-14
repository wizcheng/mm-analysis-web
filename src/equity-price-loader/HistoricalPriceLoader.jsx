import React, {Component} from 'react';
import { connect } from 'react-redux';
import request from 'superagent';
import './price-loader.css';

class HistoricalPriceLoader extends Component {

    componentDidMount() {
        const {ric, rangeFrom, rangeTo, load, priceType} = this.props;
        load(ric, rangeFrom, rangeTo, priceType);
    }

    render() {
        const {ric, priceType, rangeFrom, rangeTo,
            handleRangeFromChange, handleRangeToChange, handleRicChange, handlePriceTypeChange, handleScaleChange,
            load, handleKeyPress,
            loadingPrice, ricDetail, priceLast, scale
        } = this.props;
        console.log('priceLast', priceLast);
        let change = (priceLast.close - priceLast.previousClose).toFixed(2);
        let changeP = (change / priceLast.previousClose * 100).toFixed(1);
        const priceClassName = change > 0 ? "rise" : (change < 0 ? "fall" : "");
        if (change > 0) {
            change = '+' + change;
            changeP = '+' + changeP;
        }

        return (
            <div>
                <div>
                    <input type='text' value={ric} onChange={handleRicChange} onKeyDown={e => handleKeyPress(e, ric, rangeFrom, rangeTo, priceType)}/>
                    <input type='text' value={rangeFrom} onChange={handleRangeFromChange}/>
                    <input type='text' value={rangeTo} onChange={handleRangeToChange}/>
                    <input type='text' value={priceType} onChange={handlePriceTypeChange}/>
                    <input type='text' value={scale} onChange={handleScaleChange}/>
                    <button onClick={() => load(ric, rangeFrom, rangeTo, priceType)}>Load</button>
                    {loadingPrice ? "Loading" : null}
                </div>
                <div className='equity-info'>
                    <div>
                        <div className='symbol'>{ricDetail.symbol}</div>
                        <div className='name'>{ricDetail.name}</div>
                        <div className='reference'>{ricDetail.currency} {ricDetail.marketOpen} - {ricDetail.marketClose} {ricDetail.timezone}</div>
                        <div className='external'>
                            |&nbsp;&nbsp;
                            <a href={`https://finance.yahoo.com/quote/${ric}/financials?p=${ric}`} target='_blank'>Yahoo Finance</a>
                        </div>
                    </div>
                    <div>
                        <div className={'price-last ' + priceClassName}>{priceLast.close}</div>
                        <div className={'price-change ' + priceClassName}>{change}</div>
                        <div className={'price-change-percentage ' + priceClassName}>({changeP}%)</div>
                        <div className={'price-date '}>{priceLast.date}</div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        ric: state.historical_price.ric,
        ricDetail: state.historical_price.ricDetail,
        priceLast: state.historical_price.priceLast,
        rangeFrom: state.historical_price.rangeFrom,
        rangeTo: state.historical_price.rangeTo,
        priceType: state.historical_price.priceType,
        scale: state.historical_price.scale,
        loadingPrice: state.historical_price.loadingPrice
    };
};


const mapDispatchToProps = (dispatch) => {

    const loadRaw = ({ric, rangeFrom, rangeTo, priceType}) => {
        dispatch({
            type: 'LOADING_START'
        });
        loadRicDetail({ric});
        request
            .get(`/price/${priceType}/${ric}/${rangeFrom}/${rangeTo}`)
            .end((err, res) => {
                if (res.body.length > 0) {
                    dispatch({
                        type: 'UPDATE_PRICE_LAST',
                        price: res.body[res.body.length - 1]
                    });
                }
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

    const loadRicDetail = ({ric}) => {
        request
            .get(`/symbol/${ric}`)
            .end((err, res) => {
                console.log('symbol', res.body);
                dispatch({
                    type: 'UPDATE_RIC_DETAIL',
                    ricDetail: res.body
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
        handleScaleChange: (event) => dispatch({ type: 'UPDATE_SCALE', scale: event.target.value }),
        load: (ric, rangeFrom, rangeTo, priceType) => { loadRaw({ric, rangeFrom, rangeTo, priceType}) }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(HistoricalPriceLoader);
