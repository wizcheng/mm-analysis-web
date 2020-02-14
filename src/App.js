import React from 'react';
import './App.css';
import CandleChart from "./candlestick-chart/CandleChart";
// import {Provider} from 'react-redux';
// import {store} from "./configure-store";
import HistoricalPriceLoader from "./equity-price-loader/HistoricalPriceLoader";
import FilterLink from "./FilterLink";

function App({match: {params}}) {
  return (
      // <Provider store={store}>
          <div className="App">
              <header className="App-header">
                  My App {params.filter}
              </header>
              <FilterLink filter='some.filter'>Link</FilterLink>
              <HistoricalPriceLoader/>
              <CandleChart height='500' width={1000}/>
          </div>
      // </Provider>
  );
}

export default App;
