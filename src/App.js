import React from 'react';
import './App.css';
import CandleChart from "./candlestick-chart/CandleChart";
import {Provider} from 'react-redux';
import {store} from "./configure-store";
import HistoricalPriceLoader from "./equity-price-loader/HistoricalPriceLoader";

function App() {
  return (
      <Provider store={store}>
          <div className="App">
              <header className="App-header">
                  My App
              </header>
              <HistoricalPriceLoader/>
              <CandleChart height='500' width={800}/>
          </div>
      </Provider>
  );
}

export default App;
