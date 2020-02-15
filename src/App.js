import React from 'react';
import './App.css';
import CandleChart from "./candlestick-chart/CandleChart";
// import {Provider} from 'react-redux';
// import {store} from "./configure-store";
import HistoricalPriceLoader from "./equity-price-loader/HistoricalPriceLoader";
import FilterLink from "./FilterLink";
import { ConnectedRouter } from 'connected-react-router'
import { Route, Switch } from 'react-router'
import { Link } from 'react-router-dom'
import WidthDetector from "./common/width-detector/WidthDetector";
import ReactResizeDetector from 'react-resize-detector';


function Price() {
    return (
        <div className="App">
            <HistoricalPriceLoader/>
            <ReactResizeDetector handleWidth>
                {({ width, _ }) => <CandleChart height='500' width={width - 30}/>}
            </ReactResizeDetector>
        </div>
    )
}

function App({history}) {
  return (
      <ConnectedRouter history={history}>
          <div className="App">
              {/*<NavBar />*/}
              <Switch>
                  <Route exact path="/price/:ric?/:start?/:end?/:type?/:scale?" component={Price} />
                  <Route path="/hello" component={() => <div>hello</div>} />
                  <Route component={() => <div>404</div>} />
              </Switch>
          </div>
      </ConnectedRouter>
  );
}

export default App;
