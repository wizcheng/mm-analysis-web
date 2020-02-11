import React from 'react';
import './App.css';
import CandleChart from "./candlestick-chart/CandleChart";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        My App
      </header>

      <CandleChart height='500' width={800} />

    </div>
  );
}

export default App;
