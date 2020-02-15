import React, {Component} from 'react';
import { connect } from 'react-redux';
import request from 'superagent';
import './price-loader.css';
import { push } from 'connected-react-router'

class HistoricalPriceLoader extends Component {

    componentDidMount() {
        const {ric, rangeFrom, rangeTo, load, priceType, scale} = this.props;
        const {path, updateVariables} = this.props;
        if (!ric || !rangeFrom || !rangeTo || !priceType || !scale) {
            let paths = path.split('/');
            console.log('paths', paths);
            updateVariables({ric: paths[2], rangeFrom: paths[3], rangeTo: paths[4], priceType: paths[5], scale: paths[6]});
            load(paths[2], paths[3], paths[4], paths[5], paths[6]);
        } else {
            load(ric, rangeFrom, rangeTo, priceType, scale);
        }
    }

    render() {
        const {ric, priceType, rangeFrom, rangeTo, scale,
            updateVariable,
            load,
            loadingPrice, ricDetail, priceLast
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
                <div className='equity-selector'>
                    <input type='text' value={ric} onChange={updateVariable.bind(this, 'ric')}/>
                    <input type='text' value={rangeFrom} onChange={updateVariable.bind(this, 'rangeFrom')}/>
                    <input type='text' value={rangeTo} onChange={updateVariable.bind(this, 'rangeTo')}/>
                    <select value={priceType} onChange={updateVariable.bind(this, 'priceType')}>
                        <option value='daily'>daily</option>
                        <option value='weekly'>weekly</option>
                    </select>
                    <select value={scale} onChange={updateVariable.bind(this, 'scale')}>
                        <option value='linear'>linear</option>
                        <option value='log'>log</option>
                    </select>
                    {loadingPrice ?
                        <button className='loading' disabled={true}>Loading ...</button> :
                        <button onClick={() => {load(ric, rangeFrom, rangeTo, priceType, scale);}}>Load</button>
                    }
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
        path: state.router.location.pathname,
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

    const loadRaw = ({ric, rangeFrom, rangeTo, priceType, scale}) => {
        console.log(`ric=${ric}, rangeFrom=${rangeFrom}, rangeTo=${rangeTo}, priceType=${priceType}, scale=${scale}`);
        dispatch(push(`/price/${ric}/${rangeFrom}/${rangeTo}/${priceType}/${scale}`));
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

    const updateVariables = (variables) => {
        dispatch({
            type: 'UPDATE_VARIABLES',
            variables: variables
        })
    };

    const updateVariable = (name, event) => {
        updateVariables({[name]: event.target.value});
    };

    return {
        updateVariables,
        updateVariable,
        load: (ric, rangeFrom, rangeTo, priceType, scale) => { loadRaw({ric, rangeFrom, rangeTo, priceType, scale}) },
        goto: (path) => dispatch(push(path))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(HistoricalPriceLoader);
